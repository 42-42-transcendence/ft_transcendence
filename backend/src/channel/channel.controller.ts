import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Channel } from './entities/channel.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelMemberRole } from 'src/channel-member/enums/channel-member-role.enum';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { ChannelTypeEnum } from './enums/channelType.enum';
import { EventsGateway } from 'src/events/events.gateway';
import { ChatService } from 'src/chat/chat.service';
import { ChatType } from 'src/chat/enums/chat-type.enum';

@ApiTags('CHANNEL')
@Controller('api/channel')
@UseGuards(AuthGuard())
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private channelMemberService: ChannelMemberService,
    private chatService: ChatService,
    @Inject(forwardRef(() => EventsGateway))
    private eventsGateway: EventsGateway,
  ) {}

  // 임시로 채널이 없으면 더미를 생성하게 함
  @ApiOperation({
    summary: '모든 채널 조회'
  })
  @ApiOkResponse({
    description: '성공',
    type: [Channel]
  })
  @Get()
  async getAllChannels(): Promise<Channel[]> {
    const channels = await this.channelService.getAllChannels();

    if (channels.length === 0) {
      for (let idx = 0; idx < 10; idx++) {
        await this.channelService.createDummy();
      }
      return (await this.channelService.getAllChannels());
    }
    return (channels);
  }

  @ApiOperation({
    summary: '채널 생성'
  })
  @ApiOkResponse({
    description: '성공',
    type: Channel
  })
  @Post()
  async createChannel(
    @GetAuth() auth: Auth,
    @Body() createChannelDto: ChannelDto
  ): Promise<Channel> {
    const user = await auth.user;
    const channel = await this.channelService.createChannel(createChannelDto);
    const role = ChannelMemberRole.OWNER;

    await this.channelMemberService.relationChannelMember({ channel, user, role });

    return (channel);
  }


  @ApiOperation({
    summary: '채널 비밀번호가 있으면 true, 아니면 false'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ isPasswordRequired: boolean }>
  })
  @Get(':id/join')
  async checkHasPassword(@Param('id') channelID: string): Promise<{ isPasswordRequired: boolean }> {
    const channel = await this.channelService.getChannelById(channelID);

    if (!channel)
      throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);

    if (channel.password !== '') {
      return { isPasswordRequired: true };
    }
    return { isPasswordRequired: false };
  }


  // 에러 status로 하면 제일 좋을 것 같긴 함
  @ApiOperation({
    summary: '들어갈 수 있는 채널인지 확인, 들어갈 수 있으면 true 아니면 false'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ isAuthenticated: boolean }>
  })
  @Post(':id/join')
  async checkJoinChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('password') password: string
  ): Promise<{ isAuthenticated: boolean }> {
    const channel = await this.channelService.getChannelByIdWithException(channelID);

    if (channel.type === ChannelTypeEnum.PUBLIC) {
      if (channel.password !== password) {
        return ({ isAuthenticated: false });
      }
    }

    const user = await auth.user;
    const member = await this.channelMemberService.getChannelMemberByChannelUser(channel, user);

    if (member && member.role === ChannelMemberRole.BLOCK) {
      return ({ isAuthenticated: false });
    }

    // DM도 일단 이렇게 느슨하게 설정
    if (channel.type === ChannelTypeEnum.PRIVATE || channel.type === ChannelTypeEnum.DM) {
      if (!member || (member && member.role === ChannelMemberRole.BLOCK)) {
        return ({ isAuthenticated: false });
      }
      else if (member.role === ChannelMemberRole.INVITE) {
        await this.channelMemberService.updateChannelMemberRoleByChannelMember(member, ChannelMemberRole.GUEST);
      }
    }

    if (!member) {
      await this.channelMemberService.relationChannelMember({
        channel,
        user,
        role: ChannelMemberRole.GUEST
      });
    }

    const content = `${user.nickname}님께서 입장하셨습니다.`;
    const chat = await this.chatService.createChatMessage({
      content,
      chatType: ChatType.SYSTEM,
      userNickname: user.nickname,
      channel,
      user
    });
    this.eventsGateway.server.to(channel.channelID).emit("updateMessage", { message: chat });

    return ({ isAuthenticated: true });
  }

  @ApiOperation({
    summary: '해당 채널을 나간다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Get(':id/leave')
  async leaveChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    await this.channelMemberService.deleteChannelMember(channel, user);
    const content = `${user.nickname}님께서 퇴장하셨습니다.`;

    const chat = await this.chatService.createChatMessage({
      content,
      chatType: ChatType.SYSTEM,
      userNickname: user.nickname,
      channel,
      user
    });

    this.eventsGateway.updateMessage(user.userID, channel.channelID, chat);

    return { message: `${user.nickname}님이 ${channel.title}을 나가셨습니다.`};
  }

  @Delete(':id/delete')
  async deleteChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
  ) {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const member = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);

    if (member.role === ChannelMemberRole.OWNER) {
      this.eventsGateway.server.to(channel.channelID).emit(
        "deleteChannel",
        `${channel.title} 채널이 제거되었습니다.`
      )
    }
  }


  @ApiOperation({
    summary: '채널 id 검색'
  })
  @ApiOkResponse({
    description: '성공',
    type: Channel
  })
  @Get(':id')
  getChannelById(@Param('id') channelID: string): Promise<Channel> {

    const channel = this.channelService.getChannelById(channelID);
    if (!channel)
      throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);

    return (channel);
  }

  @ApiOperation({
    summary: '채널 내 멤버 전체 조회'
  })
  @ApiOkResponse({
    description: '성공',
    type: [ChannelMember]
  })
  @Get(':id/members')
  getJoinChannelMembers(@Param('id') channelID: string): Promise<ChannelMember[]> {
    return (this.channelService.getJoinChannelMembers(channelID));
  }

  @ApiOperation({
    summary: '채널 id 삭제'
  })
  @ApiOkResponse({
    description: '성공',
  })
  @Delete(':id')
  async deleteChannelById(
    @Param('id') channelID: string,
    @GetAuth() auth: Auth,
  ): Promise<void> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const member = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);

    if (member.role !== ChannelMemberRole.OWNER) {
      throw new BadRequestException(`${user.nickname}은 권한이 없습니다.`);
    }

    await this.channelService.deleteChannelById(channelID);
  }

  @ApiOperation({
    summary: '해당 채널의 정보를 수정한다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Patch(':id')
  async updateChannelInfo(
    @Param('id') channelID: string,
    @GetAuth() auth: Auth,
    @Body() updateChannelDto: ChannelDto
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const member = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);

    if (member.role !== ChannelMemberRole.OWNER) {
      throw new BadRequestException(`${user.nickname}은 권한이 없습니다.`);
    }

    await this.channelService.updateChannelInfo(channel, updateChannelDto);

    return ({ message: `해당 채널의 정보를 수정했습니다.` });
  }

}
