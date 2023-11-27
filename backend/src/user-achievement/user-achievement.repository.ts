import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UserAchievement } from './entities/user-achievement.entity';
import { AchievementRepository } from 'src/achievement/achievement.repository';

@Injectable()
export class UserAchievementRepository extends Repository<UserAchievement> {
  constructor(
    private dataSource: DataSource,
    private achivementRepository: AchievementRepository,
  ) {
    super(UserAchievement, dataSource.createEntityManager());
  }

  async adduserachievement(nickname: string, id: number, isAchieved: boolean): Promise<UserAchievement> {
    if (!this.achivementRepository.findachievement(id)) this.achivementRepository.createachievement(id);
    const createduserachievement = this.create({
      nickname: nickname,
      achievementId: id,
      isAchieved: isAchieved,
    });
    return await this.save(createduserachievement);
  }
}
