import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { UserStatus } from './enums/user-status.enum';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from './dto/create-user.dto';
import { UerprofileUserDto } from './dto/userprofile-user.dto';
import { UserAchievementRepository } from 'src/user-achievement/user-achievement.repository';
import { achievements, Achievements } from 'src/achievement/achievement';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    private userAchievementRepository: UserAchievementRepository,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(name: string): Promise<User> {
    const user = this.create({
      nickname: name,
      status: UserStatus.ONLINE,
    });
    const result = await this.save(user);

    return result;
  }

  async createUser_default(nickname: string): Promise<User> {
    const nick = nickname;

    const UserTable = this.create({
      nickname: nick,
    });

    const result = await this.save(UserTable);
    return result;
  }
  //실제 POST요청 createUSER

  async getUserById(userID: string): Promise<User> {
    const user = await this.findOneBy({ userID });

    if (!user) throw new NotFoundException(`해당 user를 찾을 수 없습니다: ${userID}`);
    return user;
  }

  async getJoinChannels(userID: string): Promise<ChannelMember[]> {
    const user = await this.getUserById(userID);

    return await user.channelMembers;
  }

  async getUserByNickname(nickname: string): Promise<User> {
    return await this.findOneBy({ nickname });
  }

  async createUserDummy(): Promise<User> {
    const dummy = this.create({
      nickname: faker.person.firstName(),
    });

    const result = this.save(dummy);
    return result;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.find();
  }

  async getUserProfile(nickname: string): Promise<UerprofileUserDto> {
    const createdUser = await this.getUserByNickname(nickname);
    const userinfo = {
      nickname: createdUser.nickname,
      image: createdUser.avatar,
      winCount: createdUser.win,
      loseCount: createdUser.lose,
      ladderPoint: createdUser.point,
      achievements: createdUser.userAchievements,
    };
    return userinfo;
  }

  async getAchivements(nickname: string) {
    const user = await this.findOne({
      where: { nickname: nickname },
    });
    if (user) {
      if (user.win >= 1 || user.lose >= 1) {
        const ret1 = await this.addAchievement(nickname, Achievements.FIRSTGAME, true);
        user.userAchievements.push(ret1);
      } else {
        const ret1 = await this.addAchievement(nickname, Achievements.FIRSTGAME, false);
        user.userAchievements.push(ret1);
      }
      if (user.win >= 1) {
        const ret2 = await this.addAchievement(nickname, Achievements.FIRSTWIN, true);
        user.userAchievements.push(ret2);
      } else {
        const ret2 = await this.addAchievement(nickname, Achievements.FIRSTWIN, false);
        user.userAchievements.push(ret2);
      }
      user.userAchievements.push(await this.addAchievement(nickname, Achievements.FIRSTWIN, false));
      user.userAchievements.push(await this.addAchievement(nickname, Achievements.FOUR, false));
      user.userAchievements.push(await this.addAchievement(nickname, Achievements.FIVE, false));
      user.userAchievements.push(await this.addAchievement(nickname, Achievements.SIX, false));
      user.userAchievements.push(await this.addAchievement(nickname, Achievements.SEVEN, false));
      user.userAchievements.push(await this.addAchievement(nickname, Achievements.EIGHT, false));
      user.userAchievements.push(await this.addAchievement(nickname, Achievements.NINE, false));
      user.userAchievements.push(await this.addAchievement(nickname, Achievements.TEN, false));
    }
  }
  async addAchievement(Usernickname: string, achievementId: number, isAchieved: boolean): Promise<UserAchievement> {
    const user = await this.getUserByNickname(Usernickname);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existingUserAchievement = await this.userAchievementRepository.findOne({
      where: { nickname: Usernickname, achievementId: achievementId },
    });
    if (!existingUserAchievement) {
      return this.userAchievementRepository.adduserachievement(Usernickname, achievementId, isAchieved);
    }
  }

  async changeStatus(nickname: string, status: UserStatus) {
    const createduser = await this.getUserByNickname(nickname);
    createduser.status = status;
    await this.save(createduser);
  }
}
