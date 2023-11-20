import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';
import { ChatModule } from 'src/chat/chat.module';
import { EventsService } from './events.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => ChannelModule),
    UserModule,
    ChannelMemberModule,
    ChatModule,
    AuthModule,
  ],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway]
})
export class EventsModule {}
