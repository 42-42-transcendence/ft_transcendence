import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Channel } from './entities/channel.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelMemberRole } from 'src/channel-member/enums/channel-member-role.enum';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { ChannelTypeEnum } from './enums/channelType.enum';

@ApiTags('CHANNEL')
@Controller('api/channel')
@UseGuards(AuthGuard())
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private channelMemberService: ChannelMemberService,
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
    @Body() createChannelDto: CreateChannelDto
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
    summary: '채널 '
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
    const channel = await this.channelService.getChannelById(channelID);

    if (!channel)
      throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);

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

    if (channel.type === ChannelTypeEnum.PRIVATE) {
      if (member && member.role !== ChannelMemberRole.INVITE) {
        return ({ isAuthenticated: false });
      }
    }

    // DM의 경우 guest로 설정할지 다른 권한으로 설정할지 생각하기
    if (channel.type === ChannelTypeEnum.DM) {
      if (member && member.role !== ChannelMemberRole.GUEST) {
        return ({ isAuthenticated: false });
      }
    }

    return ({ isAuthenticated: true });
  }


  @ApiOperation({
    summary: 'channel-member 관계 만들고 channel 정보 리턴'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<Channel>
  })
  @Get(':id/join/auth')
  async joinChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string
  ): Promise<Channel> {
    const channel = await this.channelService.getChannelById(channelID);

    if (!channel)
      throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);

    const user = await auth.user;
    const role = ChannelMemberRole.GUEST;

    await this.channelMemberService.relationChannelMember({ channel, user, role });
    await channel.chats;
    return (channel);
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
  async deleteChannelById(@Param('id') channelID: string): Promise<void> {
    await this.channelService.deleteChannelById(channelID);
  }

}
