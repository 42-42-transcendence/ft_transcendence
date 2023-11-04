import { PartialType } from '@nestjs/swagger';
import { CreateUserAchievementDto } from './create-user-achievement.dto';

export class UpdateUserAchievementDto extends PartialType(CreateUserAchievementDto) {}
