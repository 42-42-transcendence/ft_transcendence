import { Module } from '@nestjs/common';
import { ChannelMemberService } from './channel-member.service';
import { ChannelMemberController } from './channel-member.controller';

@Module({
  controllers: [ChannelMemberController],
  providers: [ChannelMemberService],
})
export class ChannelMemberModule {}
