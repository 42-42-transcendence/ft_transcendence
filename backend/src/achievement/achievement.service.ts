import { Injectable } from '@nestjs/common';
import { AchievementDto } from './dto/achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';
import { Achievement } from './entities/achievement.entity';
import { AchievementRepository } from './achievement.repository';

@Injectable()
export class AchievementService {
  constructor(private achievementRepository: AchievementRepository) {}
  create(achievementDto: AchievementDto) {
    return 'This action adds a new achievement';
  }

  async initAchievement() {
    await this.achievementRepository.initAchievement();
  }

  async findAll(): Promise<Achievement[]> {
    return await this.achievementRepository.findAll();
  }

  findOne(id: string) {
    return `This action returns a #${id} achievement`;
  }

  async getachievementById(id: number): Promise<Achievement> {
    return await this.achievementRepository.getachievementById(id);
  }

  update(id: string, updateAchievementDto: UpdateAchievementDto) {
    return `This action updates a #${id} achievement`;
  }

  remove(id: string) {
    return `This action removes a #${id} achievement`;
  }
}
