import { ApiProperty } from '@nestjs/swagger';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'site 별명',
    example: 'kobemom',
    type: 'string',
    uniqueItems: true,
  })
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
    example: './User/byeonkim/images/kobe.jpg',
    required: true,
  })
  avatar: string;
}
