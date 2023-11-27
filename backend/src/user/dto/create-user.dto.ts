import { ApiProperty } from '@nestjs/swagger';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'site 별명',
    example: 'kobemom',
    type: 'string',
    uniqueItems: true,
  })
  userID: string;
}
