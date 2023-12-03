import { ApiProperty } from '@nestjs/swagger';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { User } from 'src/user/entities/user.entity';
export class UserAchievementDto {
  achievement: Achievement;

  user: User;

  isAchieved: boolean;
}
