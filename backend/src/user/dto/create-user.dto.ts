import { ApiProperty } from '@nestjs/swagger';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';

export class CreateUserDto {
  userID: string | null;

  avatar: Express.Multer.File | null;
}
