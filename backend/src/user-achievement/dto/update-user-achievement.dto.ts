import { PartialType } from '@nestjs/swagger';
import { UserAchievementDto } from './user-achievement.dto';

export class UpdateUserAchievementDto extends PartialType(UserAchievementDto) {}
