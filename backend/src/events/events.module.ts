import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';
import { ChatModule } from 'src/chat/chat.module';
import { EventsService } from './events.service';
import { UserModule } from 'src/user/user.module';
import { RelationModule } from 'src/relation/relation.module';
import { NotificationModule } from 'src/notification/notification.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    forwardRef(() => ChannelModule),
    forwardRef(() => RelationModule),
    forwardRef(() => UserModule),
    ChannelMemberModule,
    ChatModule,
    forwardRef(() => AuthModule),
    forwardRef(() => GameModule),
    NotificationModule,
  ],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway, EventsService]
})
export class EventsModule {}
