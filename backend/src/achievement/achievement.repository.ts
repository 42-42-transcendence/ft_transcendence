import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Achievement } from './entities/achievement.entity';
import { achievements, Achievements } from './achievement';
import { AchievementDto } from './dto/achievement.dto';

@Injectable()
export class AchievementRepository extends Repository<Achievement> {
  constructor(private dataSource: DataSource) {
    super(Achievement, dataSource.createEntityManager());
  }
  async createachievement(id: number): Promise<Achievement> {
    const createdachievement = this.create({
      id: achievements[id].id,
      name: achievements[id].name,
      description: achievements[id].description,
    });

    const result = await this.save(createdachievement);
    console.log(result.description);
    return result;
  }

  async getachievementById(id: number): Promise<Achievement> {
    return await this.findOne({ where: { id } });
  }

  async findAll(): Promise<Achievement[]> {
    return await this.find();
  }

  async initAchievement() {
    for (let i = 0; i < 10; i++) await this.createachievement(i);
  }
}
