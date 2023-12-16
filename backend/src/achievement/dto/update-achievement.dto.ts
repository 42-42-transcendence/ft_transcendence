import { PartialType } from '@nestjs/swagger';
import { AchievementDto } from './achievement.dto';

export class UpdateAchievementDto extends PartialType(AchievementDto) {}
