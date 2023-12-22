import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ChannelService } from './channel/channel.service';
import { UserService } from './user/user.service';
import { ChannelMemberService } from './channel-member/channel-member.service';
import { ChatService } from './chat/chat.service';
import { ChannelMemberRole } from './channel-member/enums/channel-member-role.enum';
import { AchievementService } from './achievement/achievement.service';
import { UserAchievementService } from './user-achievement/user-achievement.service';

@Controller()
export class AppController implements OnModuleInit{
  constructor(
    private readonly appService: AppService,
    private channelService: ChannelService,
    private userService: UserService,
    private channelMemberService: ChannelMemberService,
    private chatService: ChatService,
    private achievementService: AchievementService,
    private userachievementService: UserAchievementService,
  ) {}

  // 추후 없앨 것
  async onModuleInit() {
    if ((await this.channelService.getAllChannels()).length === 0) {
      for (let idx = 0; idx < 3; idx++) {
        await this.channelService.createChannelDummy();
      }
    }
    if ((await this.userService.getAllUsers()).length === 0) {
      for (let idx = 0; idx < 7; idx++) {
        await this.userService.createUserDummy();
      }
    }
    if ((await this.achievementService.findAll()).length === 0) {
      await this.achievementService.initAchievement();
    }
    if ((await this.channelMemberService.getAllChannelMembers()).length === 0) {
      const newChannels = await this.channelService.getAllChannels();
      const newUsers = await this.userService.getAllUsers();

      for (let idx = 0; idx < 3; idx++) {
        const channel = newChannels[idx];
        const user = newUsers[idx];
        const member = await this.channelMemberService.getChannelMemberByChannelUser(channel, user);
        if (!member) {
          await this.channelMemberService.relationChannelMember({
            channel,
            user,
            role: ChannelMemberRole.OWNER
          });
          await this.channelService.enterUserToChannel(newChannels[idx]);
        }
      }

      for (let idx = 0; idx < 3; idx++) {
        const channel = newChannels[idx];
        for (let i = 0; i < 4; i++) {
          const userIdx = Math.floor(Math.random() * 7);
          const user = newUsers[userIdx];
          const member = await this.channelMemberService.getChannelMemberByChannelUser(channel, user);
          if (!member) {
            await this.channelMemberService.relationChannelMember({
              channel,
              user,
              role: ChannelMemberRole.GUEST
            });
            await this.channelService.enterUserToChannel(newChannels[idx]);
          }
        }
      }
    }

    if ((await this.chatService.getAllChats()).length === 0) {
      const newChannels = await this.channelService.getAllChannels();

      for (let i = 0; i < newChannels.length; i++) {
        const channel = newChannels[i];
        const members = await this.channelMemberService.getChannelMembersWithUserFromChannel(channel);
        const chatCount = Math.floor(Math.random() * 10) + 15;

        for (let j = 0; j < chatCount; j++) {
          const memberIdx = Math.floor(Math.random() * members.length);
          const member = members[memberIdx];
          await this.chatService.createChatDummy(channel, member.user);
        }
      }
    }
  }
}
