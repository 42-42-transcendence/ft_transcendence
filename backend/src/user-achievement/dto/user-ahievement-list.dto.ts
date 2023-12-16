import { ApiProperty } from '@nestjs/swagger';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { User } from 'src/user/entities/user.entity';
export class UserAchievementlistDto {
  id: number;

  @ApiProperty({
    description: '도전과제 이름',
    example: 'First Victory!',
    type: 'string',
    uniqueItems: true,
  })
  title: string;

  @ApiProperty({
    description: '도전과제 설명',
    example: 'First Blood!',
    uniqueItems: true,
  })
  description: string;

  isAchieved: boolean;
}
