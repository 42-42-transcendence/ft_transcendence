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
import { RelationService } from 'src/relation/relation.service';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';

@ApiTags('CHANNEL')
@Controller('api/channel')
@UseGuards(AuthGuard())
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private channelMemberService: ChannelMemberService,
    private chatService: ChatService,
    private userService: UserService,
    private relationService: RelationService,
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
    return (await this.channelService.getAllChannels());
  }


  @ApiOperation({
    summary: '채널 생성'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ channelID: string }>
  })
  @Post()
  async createChannel(
    @GetAuth() auth: Auth,
    @Body() createChannelDto: ChannelDto
  ): Promise<{ channelID: string }> {
    const user = await auth.user;
    const channel = await this.channelService.createChannel(createChannelDto);
    const role = ChannelMemberRole.OWNER;

    await this.channelMemberService.relationChannelMember({ channel, user, role });
    await this.channelService.enterUserToChannel(channel);

    return ({ channelID: channel.channelID });
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
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const member = await this.channelMemberService.getChannelMemberByChannelUser(channel, user);
    const content = `${user.nickname}님께서 입장하셨습니다.`;

    // DM도 일단 이렇게 느슨하게 설정
    if ((channel.type === ChannelTypeEnum.PRIVATE) || (channel.type === ChannelTypeEnum.DM)) {
      if (!member || (member && member.role === ChannelMemberRole.BLOCK)) {
        return ({ isAuthenticated: false });
      }
      if (member.role === ChannelMemberRole.INVITE) {
        await this.channelMemberService.updateChannelMemberRoleByChannelMember(member, ChannelMemberRole.GUEST);
        await this.channelService.enterUserToChannel(channel);
        this.eventsGateway.updatedSystemMessage(content, channel, user);
      }
      return ({ isAuthenticated: true });
    }

    if (channel.password !== password) {
      return ({ isAuthenticated: false });
    }

    if (member && (member.role === ChannelMemberRole.BLOCK)) {
      return ({ isAuthenticated: false });
    }

    if (member && (member.role === ChannelMemberRole.INVITE)) {
      await this.channelMemberService.updateChannelMemberRoleByChannelMember(member, ChannelMemberRole.GUEST);
      await this.channelService.enterUserToChannel(channel);
      this.eventsGateway.updatedSystemMessage(content, channel, user);
    }

    if (!member) {
      await this.channelMemberService.relationChannelMember({
        channel,
        user,
        role: ChannelMemberRole.GUEST
      });
      await this.channelService.enterUserToChannel(channel);
      this.eventsGateway.updatedSystemMessage(content, channel, user);
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


  @ApiOperation({
    summary: '해당 채널을 제거한다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Delete(':id')
  async deleteChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const member = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);

    if (member.role !== ChannelMemberRole.OWNER) {
      throw new BadRequestException(`${user.nickname}님은 채널을 제거할 권한이 없습니다.`);
    }

    this.eventsGateway.server.to(channel.channelID).emit(
      "firedChannel",
      { message: `${channel.title}채널이 제거되었습니다.` }
    );

    // this.eventsGateway.server.to(channel.channelID).emit("firedMessage", { message: `${kickedUser.nickname}님께서는 추방되었습니다.` });
    await this.channelService.deleteChannelById(channelID);

    return ({ message: `해당 채널을 제거했습니다.` });
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
      await this.eventsGateway.updatedMembersForAllUsers(channel);

      const content = `${newStaffUser.nickname}님의 스태프 권한이 해제되었습니다.`;
      await this.eventsGateway.updatedSystemMessage(content, channel, user);

      return ({ message: content } )
    }

    await this.channelMemberService.updateChannelMemberRoleByChannelMember(
      objectUserRole,
      ChannelMemberRole.STAFF
    );
    await this.eventsGateway.updatedMembersForAllUsers(channel);

    const content = `${newStaffUser.nickname}님이 스태프로 임명되었습니다.`;
    await this.eventsGateway.updatedSystemMessage(content, channel, user);

    return ({ message: content });
  }


  @ApiOperation({
    summary: '특정 인원을 추방시키고 채널에 못들어오게 한다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post(':id/kick')
  async kickUserFromChannel(
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

    await this.channelMemberService.updateChannelMemberRoleByChannelMember(
      objectUserRole,
      ChannelMemberRole.BLOCK
    );
    await this.eventsGateway.kickOutSpecificClient(
      `${kickedUser.nickname}님은 ${channel.title}에서 추방되었습니다.`,
      kickedUser,
      channel
    )
    await this.channelService.leaveUserToChannel(channel);
    await this.eventsGateway.updatedMembersForAllUsers(channel);

    const content = `${kickedUser.nickname}님께서 추방되었습니다.`;
    await this.eventsGateway.updatedSystemMessage(content, channel, user);

    return ({ message: content });
  }


  @ApiOperation({
    summary: '특정 인원을 채널에 초대한다.'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post(':id/invite')
  async inviteToChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('invitedUser') invitedUserID: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const invitedUser = await this.userService.getUserByIdWithException(invitedUserID);
    const subjectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);
    const objectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, invitedUser);

    if (!subjectUserRole) {
      throw new BadRequestException(`${user.nickname}님은 채널에 존재하지 않습니다.`);
    }

    if (subjectUserRole.role === ChannelMemberRole.BLOCK
        || subjectUserRole.role === ChannelMemberRole.INVITE ) {
      throw new BadRequestException(`${user.nickname}님은 초대권한이 없습니다.`);
    }

    if (objectUserRole) {
      if (objectUserRole.role === ChannelMemberRole.INVITE) {
        throw new BadRequestException(`${invitedUser.nickname}님은 이미 초대를 보냈습니다.`);
      }
      else if (objectUserRole.role === ChannelMemberRole.BLOCK) {
        throw new BadRequestException(`${invitedUser.nickname}님은 초대할 수 없습니다.`);
      }
      else {
        throw new BadRequestException(`${invitedUser.nickname}님은 이미 채널에 존재합니다.`);
      }
    }

    await this.channelMemberService.relationChannelMember({
      channel,
      user: invitedUser,
      role: ChannelMemberRole.INVITE
    });

    const content = `${invitedUser.nickname}님께 초대를 보냈습니다.`;
    await this.eventsGateway.updatedSystemMessage(content, channel, user);

    // noti로 해당 인물에게 초대 알림을 보내야함

    return ({ message: content });
  }


  @ApiOperation({
    summary: '특정 인원에게 DM을 보낸다.'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ channelID: string }>
  })
  @Post('DM')
  async createDirectMessage(
    @GetAuth() auth: Auth,
    @Body('invitedUser') invitedUserID: string,
  ): Promise<{ channelID: string }> {
    const user = await auth.user;
    const invitedUser = await this.userService.getUserByIdWithException(invitedUserID);
    const channel = await this.channelService.createChannel({
      title: `${user.nickname}-${invitedUser.nickname} DM`,
      password: '',
      type: ChannelTypeEnum.DM
    });
    const role = ChannelMemberRole.OWNER;

    await this.channelMemberService.relationChannelMember({ channel, user, role });
    await this.channelService.enterUserToChannel(channel);
    await this.channelMemberService.relationChannelMember({ channel, user: invitedUser, role });
    await this.channelService.enterUserToChannel(channel);

    return ({ channelID: channel.channelID });
  }


  // 이거 채널 밖에서 차단하는거 생각하면 User나 Relation에서 하는게 맞지않나?
  @ApiOperation({
    summary: '특정 인원의 메세지가 보이지 않도록 차단한다.'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post(':id/block')
  async blockUserFromChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('blockedUser') blockedUserID: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const blockedUser = await this.userService.getUserByIdWithException(blockedUserID);
    const relation = await this.relationService.getRelationByUsers(user, blockedUser);

    if (!relation) {
      await this.relationService.createRelation({
        subjectUser: user,
        objectUser: blockedUser,
        relationType: RelationTypeEnum.BLOCK
      });
    }
    else if (relation.relationType === RelationTypeEnum.BLOCK) {
      await this.relationService.deleteRelation(user, blockedUser);
    }
    else {
      await this.relationService.updateRelationByRelation(relation, RelationTypeEnum.BLOCK);
    }
    await this.eventsGateway.updatedMembersForOneUser(user, channel);

    return ({ message: `${blockedUser.nickname}님을 차단했습니다.` })
  }


  // 일단 토글 되는 방식으로만 해본다.
  @ApiOperation({
    summary: '특정 인원을 (일정 시간동안) 뮤트시킨다.'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post(':id/staff')
  async muteUserFromChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('mutedUser') mutedUserID: string,
    ): Promise<{ message: string }> {
      const user = await auth.user;
      const channel = await this.channelService.getChannelByIdWithException(channelID);
      const mutedUser = await this.userService.getUserByIdWithException(mutedUserID);
      const subjectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);
      const objectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, mutedUser);

      if (!subjectUserRole) {
        throw new BadRequestException(`${user.nickname}님은 채널에 존재하지 않습니다.`);
      }

      if (subjectUserRole.role !== ChannelMemberRole.OWNER
          && subjectUserRole.role !== ChannelMemberRole.STAFF ) {
        throw new BadRequestException(`${user.nickname}님은 뮤트권한이 없습니다.`);
      }

      if (!objectUserRole
          || (objectUserRole.role === ChannelMemberRole.INVITE
              || objectUserRole.role === ChannelMemberRole.BLOCK)) {
        throw new BadRequestException(`${mutedUser.nickname}님은 채널에 존재하지 않습니다.`);
      }

      if (objectUserRole.role === ChannelMemberRole.OWNER) {
        throw new BadRequestException(`${mutedUser.nickname}님은 채널 소유자입니다.`);
      }

      if (objectUserRole.isMuted === true) {
        this.channelMemberService.updateChannelMemberIsMutedByChannelMember(objectUserRole, false);
        const content = `${mutedUser.nickname}님께서 뮤트가 해제되었습니다.`;
        await this.eventsGateway.updatedSystemMessage(content, channel, user);

        return ({ message: content });
      }

      this.channelMemberService.updateChannelMemberIsMutedByChannelMember(objectUserRole, true);
        // setTimeout(() => {
        //   if (objectUserRole.isMuted === true) {
        //     this.channelMemberService.updateChannelMemberIsMutedByChannelMember(objectUserRole, false);
        //   }
        // }, 1000 * 60 * 10);

      const content = `${mutedUser.nickname}님께서 뮤트되었습니다.`;
      await this.eventsGateway.updatedSystemMessage(content, channel, user);

      return ({ message: content });
    }

}
