import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { UserAchievementModule } from './user-achievement/user-achievement.module';
import { ChannelMemberModule } from './channel-member/channel-member.module';
import { RelationModule } from './relation/relation.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UserAchievementModule, ChannelMemberModule, RelationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
