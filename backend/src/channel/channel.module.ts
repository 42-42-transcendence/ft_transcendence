import { Module, forwardRef } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelRepository } from './channel.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';
import { EventsModule } from 'src/events/events.module';
import { ChatModule } from 'src/chat/chat.module';
import { UserModule } from 'src/user/user.module';
import { RelationModule } from 'src/relation/relation.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    forwardRef(() => EventsModule),
    forwardRef(() => RelationModule),
    TypeOrmModule.forFeature([Channel]),
    ChannelMemberModule,
    ChatModule,
    AuthModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    ChannelRepository,
  ],
  exports: [ChannelService, ChannelRepository]
})
export class ChannelModule {}
