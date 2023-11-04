import { Injectable } from '@nestjs/common';
import { CreateUserAchievementDto } from './dto/create-user-achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user-achievement.dto';

@Injectable()
export class UserAchievementService {
  create(createUserAchievementDto: CreateUserAchievementDto) {
    return 'This action adds a new userAchievement';
  }

  findAll() {
    return `This action returns all userAchievement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAchievement`;
  }

  update(id: number, updateUserAchievementDto: UpdateUserAchievementDto) {
    return `This action updates a #${id} userAchievement`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAchievement`;
  }
}
