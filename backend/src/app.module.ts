import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { UserAchievementModule } from './user-achievement/user-achievement.module';
import { ChannelMemberModule } from './channel-member/channel-member.module';
import { RelationModule } from './relation/relation.module';
import { AchievementModule } from './achievement/achievement.module';
import { ChannelModule } from './channel/channel.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { NotificationModule } from './notification/notification.module';
import { OtpModule } from './otp/otp.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    AchievementModule,
    ChannelModule,
    ChannelMemberModule,
    ChatModule,
    GameModule,
    RelationModule,
    UserModule,
    UserAchievementModule,
    AuthModule,
    EventsModule,
    NotificationModule,
    OtpModule,
    MulterModule.register({
      dest: '../assets/images',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
