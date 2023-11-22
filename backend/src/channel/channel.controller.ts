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
import { UserService } from 'src/user/user.service';

@ApiTags('CHANNEL')
@Controller('api/channel')
@UseGuards(AuthGuard())
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private channelMemberService: ChannelMemberService,
    private chatService: ChatService,
    private userService: UserService,
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
        await this.channelService.createChannelDummy();
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
    await this.channelService.enterUserToChannel(channel);

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
      if (member.role === ChannelMemberRole.INVITE) {
        await this.channelMemberService.updateChannelMemberRoleByChannelMember(member, ChannelMemberRole.GUEST);
        await this.channelService.enterUserToChannel(channel);
      }
    }

    if (!member) {
      await this.channelMemberService.relationChannelMember({
        channel,
        user,
        role: ChannelMemberRole.GUEST
      });
      await this.channelService.enterUserToChannel(channel);
  
      const content = `${user.nickname}님께서 입장하셨습니다.`;
      const chat = await this.chatService.createChatMessage({
        content,
        chatType: ChatType.SYSTEM,
        userNickname: user.nickname,
        channel,
        user
      });
      this.eventsGateway.server.to(channel.channelID).emit("updatedMessage", { message: chat });
    }

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
    await this.channelService.leaveUserToChannel(channel);
    const content = `${user.nickname}님께서 퇴장하셨습니다.`;

    const chat = await this.chatService.createChatMessage({
      content,
      chatType: ChatType.SYSTEM,
      userNickname: user.nickname,
      channel,
      user
    });

    this.eventsGateway.updatedMessage(user.userID, channel.channelID, chat);

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


  @ApiOperation({
    summary: '특정 인원에게 스태프 권한을 부여한다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post(':id/staff')
  async assignToChannelStaff(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('newStaffUser') newStaffUserID: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const newStaffUser = await this.userService.getUserByIdWithException(newStaffUserID);
    const subjectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);
    const objectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, newStaffUser);

    if (!subjectUserRole) {
      throw new BadRequestException(`${user.nickname}님은 채널에 존재하지 않습니다.`);
    }

    if (subjectUserRole.role !== ChannelMemberRole.OWNER) {
      throw new BadRequestException(`${user.nickname}은 스태프 부여 권한이 없습니다.`);
    }

    if (!objectUserRole) {
      throw new BadRequestException(`${newStaffUser.nickname}님은 채널에 존재하지 않습니다.`);
    }

    if (objectUserRole.role === ChannelMemberRole.OWNER) {
      throw new BadRequestException(`${newStaffUser.nickname}은 채널 소유자입니다.`);
    }

    if (objectUserRole.role === ChannelMemberRole.INVITE) {
      throw new BadRequestException(`${newStaffUser.nickname}은 아직 초대상태입니다.`);
    }

    if (objectUserRole.role === ChannelMemberRole.STAFF) {
      await this.channelMemberService.updateChannelMemberRoleByChannelMember(
        objectUserRole,
        ChannelMemberRole.GUEST
      );
      await this.eventsGateway.updatedMembers(channel);

      const content = `${newStaffUser.nickname}님의 스태프 권한이 해제되었습니다.`;
      await this.eventsGateway.updatedSystemMessage(content, channel, user);

      return ({ message: content } )
    }

    await this.channelMemberService.updateChannelMemberRoleByChannelMember(
      objectUserRole,
      ChannelMemberRole.STAFF
    );
    await this.eventsGateway.updatedMembers(channel);

    const content = `${newStaffUser.nickname}님이 스태프로 임명되었습니다.`;
    await this.eventsGateway.updatedSystemMessage(content, channel, user);

    return ({ message: content });
  }


  @Post(':id/kick')
  async kickFromChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('kickedUser') kickedUserID: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const kickedUser = await this.userService.getUserByIdWithException(kickedUserID);
    const subjectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);
    const objectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, kickedUser);

    if (!subjectUserRole) {
      throw new BadRequestException(`${user.nickname}님은 채널에 존재하지 않습니다.`);
    }

    if (subjectUserRole.role !== ChannelMemberRole.OWNER 
        && subjectUserRole.role !== ChannelMemberRole.STAFF ) {
      throw new BadRequestException(`${user.nickname}님은 강퇴권한이 없습니다.`);
    }

    if (!objectUserRole || (objectUserRole.role === ChannelMemberRole.INVITE)) {
      throw new BadRequestException(`${kickedUser.nickname}님은 채널에 존재하지 않습니다.`);
    }

    if (objectUserRole.role === ChannelMemberRole.OWNER) {
      throw new BadRequestException(`${kickedUser.nickname}님은 채널 소유자입니다.`);
    }

    if (objectUserRole.role === ChannelMemberRole.BLOCK) {
      throw new BadRequestException(`${kickedUser.nickname}님은 이미 추방되었습니다.`);
    }

    // 이 사이에 추방유저를 채널로비로 이동시키는 무언가가 있어야함.

    await this.channelMemberService.updateChannelMemberRoleByChannelMember(
      objectUserRole,
      ChannelMemberRole.BLOCK
    );
    await this.channelService.leaveUserToChannel(channel);
    await this.eventsGateway.updatedMembers(channel);

    const content = `${kickedUser.nickname}님께서 추방되었습니다.`;
    await this.eventsGateway.updatedSystemMessage(content, channel, user);
    
    return ({ message: content });
  }

}
