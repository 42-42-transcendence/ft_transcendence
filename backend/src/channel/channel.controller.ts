import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Channel } from './entities/channel.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelMemberRole } from 'src/channel-member/enums/channel-member-role.enum';
import { ChannelTypeEnum } from './enums/channelType.enum';
import { EventsGateway } from 'src/events/events.gateway';
import { ChatService } from 'src/chat/chat.service';
import { ChatType } from 'src/chat/enums/chat-type.enum';
import { UserService } from 'src/user/user.service';
import { RelationService } from 'src/relation/relation.service';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';
import { NotificationService } from 'src/notification/notification.service';
import { NotiType } from 'src/notification/enums/noti-type.enum';

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
    private notificationService: NotificationService,
    @Inject(forwardRef(() => EventsGateway))
    private eventsGateway: EventsGateway,
  ) {}


  @ApiOperation({
    summary: '모든 공개 채널 및 유저가 참여한 private, dm 채널 조회'
  })
  @ApiOkResponse({
    description: '성공',
    type: [Channel]
  })
  @Get()
  async getAllChannels(
    @GetAuth() auth: Auth
  ): Promise<Channel[]> {
    const user = await auth.user;
    const channels: Channel[] = [];
    const publicChannels = await this.channelService.getPublicChannels();
    const privateChannels = await this.channelMemberService.getPrivateChannelsByUser(user);
    const dmChannels = await this.channelMemberService.getDmChannelsByUser(user);

    channels.push(...publicChannels);
    channels.push(...privateChannels);
    channels.push(...dmChannels);

    return (channels);
  }


  @ApiOperation({
    summary: 'channelID로 채널 정보를 가져온다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<Channel>
  })
  @Get(':id')
  async getChannelInfoById(
    @Param('id') channelID: string
  ): Promise<Channel> {
    return (await this.channelService.getChannelById(channelID));
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

    await this.channelService.enterUserToChannel(channel);
    await this.channelMemberService.relationChannelMember({ channel, user, role });


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
        await this.channelService.enterUserToChannel(channel);
        await this.channelMemberService.updateChannelMemberRoleByChannelMember(member, ChannelMemberRole.GUEST);
        this.eventsGateway.updatedSystemMessage(content, channel, user);
        this.eventsGateway.updatedMembersForAllUsers(channel);
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
      await this.channelService.enterUserToChannel(channel);
      await this.channelMemberService.updateChannelMemberRoleByChannelMember(member, ChannelMemberRole.GUEST);
      this.eventsGateway.updatedSystemMessage(content, channel, user);
      this.eventsGateway.updatedMembersForAllUsers(channel);
    }

    if (!member) {
      await this.channelService.enterUserToChannel(channel);
      await this.channelMemberService.relationChannelMember({
        channel,
        user,
        role: ChannelMemberRole.GUEST
      });
      this.eventsGateway.updatedSystemMessage(content, channel, user);
      this.eventsGateway.updatedMembersForAllUsers(channel);
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
    const member = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);
    // 현재 chat을 만들고 channel 정보업데이트를 하면, chat이 삭제되는 현상이 있음.
    // orphanedRowAction 없다면, chat의 channel을 null로 만든다
    // 해결할려면, 일단 channel 정보 먼저 업데이트하고, chat을 만드는 방법밖에 없음...
    await this.channelService.leaveUserToChannel(channel);
    if (member.role === ChannelMemberRole.OWNER && channel.total > 0) {
      const newOwner = await this.channelMemberService.delegateChannelOwner(channel);
      const newOwnerUser = await this.channelMemberService.getUserFromChannelMember(newOwner);
      const content = `${user.nickname}님이 ${newOwnerUser.nickname}님에게 OWNER를 위임했습니다.`;
      await this.eventsGateway.updatedSystemMessage(content, channel, newOwnerUser);
    }
    await this.channelMemberService.deleteChannelMemberById(member.channelMemberID);
    const content = `${user.nickname}님께서 퇴장하셨습니다.`;
    await this.eventsGateway.updatedSystemMessage(content, channel, user);
    await this.eventsGateway.updatedMembersForAllUsers(channel);

    if (channel.total === 0) {
      await this.channelService.deleteChannelById(channel.channelID);
    }

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
      "firedChannel", `${channel.title}채널이 제거되었습니다.`);
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

    const result = await this.channelService.updateChannelInfo(channel, updateChannelDto);
    this.eventsGateway.server.to(result.channelID).emit("updatedChannelTitle", result.title);

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
    @Body('targetUserID') targetUser: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const newStaffUser = await this.userService.getUserByNicknameWithException(targetUser);
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
    summary: '특정 인원을 추방시킨다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post(':id/kick')
  async kickUserFromChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('targetUserID') targetUser: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const kickedUser = await this.userService.getUserByNicknameWithException(targetUser);
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
      throw new BadRequestException(`${kickedUser.nickname}님은 이미 영구 추방되었습니다.`);
    }

    await this.eventsGateway.kickOutSpecificClient(
      `${kickedUser.nickname}님은 ${channel.title}에서 추방되었습니다.`,
      kickedUser,
      channel
    )
    await this.channelService.leaveUserToChannel(channel);

    // 멤버 지워야 함
    await this.channelMemberService.deleteChannelMemberById(objectUserRole.channelMemberID);

    const content = `${kickedUser.nickname}님께서 추방되었습니다.`;
    await this.eventsGateway.updatedSystemMessage(content, channel, user);
    await this.eventsGateway.updatedMembersForAllUsers(channel);

    return ({ message: content });
  }


  @ApiOperation({
    summary: '특정 인원을 영구 추방시킨다'
  })
  @ApiOkResponse({
    description: '성공',
    type: Promise<{ message: string }>
  })
  @Post(':id/ban')
  async banUserFromChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('targetUserID') targetUser: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const banedUser = await this.userService.getUserByNicknameWithException(targetUser);
    const subjectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);
    const objectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, banedUser);

    if (!subjectUserRole) {
      throw new BadRequestException(`${user.nickname}님은 채널에 존재하지 않습니다.`);
    }

    if (subjectUserRole.role !== ChannelMemberRole.OWNER
        && subjectUserRole.role !== ChannelMemberRole.STAFF ) {
      throw new BadRequestException(`${user.nickname}님은 강퇴권한이 없습니다.`);
    }

    if (!objectUserRole || (objectUserRole.role === ChannelMemberRole.INVITE)) {
      throw new BadRequestException(`${banedUser.nickname}님은 채널에 존재하지 않습니다.`);
    }

    if (objectUserRole.role === ChannelMemberRole.OWNER) {
      throw new BadRequestException(`${banedUser.nickname}님은 채널 소유자입니다.`);
    }

    if (objectUserRole.role === ChannelMemberRole.BLOCK) {
      throw new BadRequestException(`${banedUser.nickname}님은 이미 영구 추방되었습니다.`);
    }

    await this.channelService.leaveUserToChannel(channel);
    await this.channelMemberService.updateChannelMemberRoleByChannelMember(
      objectUserRole,
      ChannelMemberRole.BLOCK
    );
    await this.eventsGateway.kickOutSpecificClient(
      `${banedUser.nickname}님은 ${channel.title}에서 영구 추방되었습니다.`,
      banedUser,
      channel
    )

    const content = `${banedUser.nickname}님께서 영구 추방되었습니다.`;
    await this.eventsGateway.updatedSystemMessage(content, channel, user);
    await this.eventsGateway.updatedMembersForAllUsers(channel);
    await this.eventsGateway.updatedNotification(
      `${banedUser.nickname}님은 ${channel.title}채널에서 영구 추방되었습니다.`,
      NotiType.BAN,
      banedUser
    )

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
    @Body('targetUserID') targetUser: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const invitedUser = await this.userService.getUserByNicknameWithException(targetUser);
    const subjectUserRole = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);
    const objectUserRole = await this.channelMemberService.getChannelMemberByChannelUser(channel, invitedUser);

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
    await this.eventsGateway.updatedNotificationWithChannelID(
      `${user.nickname}님이 ${channel.title}로 초대하셨습니다.`,
      NotiType.INVITE,
      invitedUser,
      channel.channelID
    );

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
    @Body('targetUserID') targetUser: string,
  ): Promise<{ channelID: string }> {
    const user = await auth.user;
    const invitedUser = await this.userService.getUserByNicknameWithException(targetUser);
    const channel = await this.channelService.createChannel({
      title: `${user.nickname}-${invitedUser.nickname} DM`,
      password: '',
      type: ChannelTypeEnum.DM
    });
    const role = ChannelMemberRole.GUEST;

    await this.channelService.enterUserToChannel(channel);
    await this.channelService.enterUserToChannel(channel);
    await this.channelMemberService.relationChannelMember({ channel, user, role });
    await this.channelMemberService.relationChannelMember({ channel, user: invitedUser, role });
    await this.eventsGateway.updatedNotificationWithChannelID(
      `${user.nickname}님으로부터 DM이 도착했습니다.`,
      NotiType.DM,
      invitedUser,
      channel.channelID
    )

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
    @Body('targetUserID') targetUser: string,
  ): Promise<{ message: string }> {
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(channelID);
    const blockedUser = await this.userService.getUserByNicknameWithException(targetUser);
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
  @Post(':id/mute')
  async muteUserFromChannel(
    @GetAuth() auth: Auth,
    @Param('id') channelID: string,
    @Body('targetUserID') targetUser: string,
    ): Promise<{ message: string }> {
      const user = await auth.user;
      const channel = await this.channelService.getChannelByIdWithException(channelID);
      const mutedUser = await this.userService.getUserByNicknameWithException(targetUser);
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
        this.eventsGateway.updatedMembersForAllUsers(channel);

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
      this.eventsGateway.updatedMembersForAllUsers(channel);

      return ({ message: content });
    }



}
