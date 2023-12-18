import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UserAchievement } from './entities/user-achievement.entity';
import { AchievementRepository } from 'src/achievement/achievement.repository';
import { UserAchievementDto } from './dto/user-achievement.dto';
import { User } from '../user/entities/user.entity';
import { UserAchievementlistDto } from './dto/user-ahievement-list.dto';
import { Achievement } from 'src/achievement/entities/achievement.entity';

@Injectable()
export class UserAchievementRepository extends Repository<UserAchievement> {
  constructor(
    private dataSource: DataSource,
    private achivementRepository: AchievementRepository,
  ) {
    super(UserAchievement, dataSource.createEntityManager());
  }

  async createuserachievement(user: User, id: number): Promise<UserAchievement> {
    const createdachievement = await this.achivementRepository.getachievementById(id);
    //에러처리 필요함 없는 유저나, 없는 도전과제 번호
    let isach;
    if (id === 0) isach = true;
    else isach = false;
    const createduserachievment = new UserAchievement();
    createduserachievment.user = user;
    createduserachievment.achievement = createdachievement;
    createduserachievment.isAchieved = isach;
    const result = await this.save(createduserachievment);
    return result;
  }

  async setuserachievementsuccess(user: User, id: number): Promise<UserAchievement> {
    const achi = await this.achivementRepository.getachievementById(id);
    const member = await this.createQueryBuilder('member')
      .leftJoinAndSelect('member.achievement', 'achievement')
      .leftJoinAndSelect('member.user', 'user')
      .where('user.userID = :userID', { userID: user.userID })
      .andWhere('achievement.id = :id', { achievement: achi.id })
      .getOne();

    return member;
  }
}
