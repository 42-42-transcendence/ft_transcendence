import { ApiProperty } from '@nestjs/swagger';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { UserAchievementlistDto } from 'src/user-achievement/dto/user-ahievement-list.dto';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';

export class UserprofileUserDto {
  @ApiProperty({
    description: '닉네임',
    example: 'vdoohkimv',
    type: 'string',
    uniqueItems: true,
  })
  nickname: string;
  @ApiProperty({
    description: '프로필 이미지',
    example: 'http://localhost:3000/assets/profiles/550e8400-e29b-41d4-a716-446655440000.jpg', 
    required: true,
  })
  image: string;

  @ApiProperty({
    description: '승리 횟수',
    example: '0',
    required: true,
  })
  winCount: number;

  @ApiProperty({
    description: '패배 횟수',
    example: '0',
    required: true,
  })
  loseCount: number;

  @ApiProperty({
    description: '랭크 점수',
    example: '1000',
    required: true,
  })
  ladderPoint: number;

  @ApiProperty({
    description: '도전과제',
    example: '(byeonkim, first_victory), ...',
  })
  achievements: UserAchievementlistDto[];
}
