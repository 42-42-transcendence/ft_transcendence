import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    ChannelModule,
    ChannelMemberModule,
    ChatModule,
    AuthModule,
  ],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
