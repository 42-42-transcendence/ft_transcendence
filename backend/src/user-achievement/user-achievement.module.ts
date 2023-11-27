import { Module } from '@nestjs/common';
import { UserAchievementService } from './user-achievement.service';
import { UserAchievementController } from './user-achievement.controller';
import { UserAchievementRepository } from './user-achievement.repository';
import { AchievementRepository } from 'src/achievement/achievement.repository';
import { UserAchievement } from './entities/user-achievement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievement]), AchievementModule],
  controllers: [UserAchievementController],
  providers: [UserAchievementService, UserAchievementRepository],
  exports: [UserAchievementService, UserAchievementRepository],
})
export class UserAchievementModule {}
