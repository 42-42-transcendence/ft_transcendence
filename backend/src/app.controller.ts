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

  async onModuleInit() {
    const channels = await this.channelService.getAllChannels();
    const users = await this.userService.getAllUsers();

    if (channels.length === 0) {
      for (let idx = 0; idx < 3; idx++) {
        await this.channelService.createChannelDummy();
      }
    }
    if (users.length === 0) {
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

    // 이 뒤는 chatdummy 구현 해보기
    // const channelMembers = await this.channelMemberService.getAllChannelMembers();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
