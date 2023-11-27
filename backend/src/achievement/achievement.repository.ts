import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Achievement } from './entities/achievement.entity';
import { achievements } from './achievement';

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

    const result = this.save(createdachievement);
    return result;
  }

  async findachievement(id: number): Promise<boolean> {
    if (!this.find({ where: { id: id } })) return false;
    return true;
  }
}
