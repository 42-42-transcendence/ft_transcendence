import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserStatus } from './enums/user-status.enum';
import { faker } from '@faker-js/faker';
import { UserprofileUserDto } from './dto/userprofile-user.dto';
import { UserAchievementRepository } from 'src/user-achievement/user-achievement.repository';
import { Achievements } from './achievement';
import { UserAchievement } from 'src/user-achievement/entities/user-achievement.entity';
// import { AchievementRepository } from 'src/achievement/achievement.repository';
import { UserAchievementlistDto } from 'src/user-achievement/dto/user-ahievement-list.dto';

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
		const user = await this
			.createQueryBuilder('user')
			.where('user.nickname = :nickname', { nickname })
			.getOne();

		return (user);
	}

  async createUserDummy(): Promise<User> {
    const dummy = this.create({
      nickname: faker.person.firstName(),
    });

		const result = await this.save(dummy);
		return (result);
	}

  async getAllUsers(): Promise<User[]> {
    return await this.find();
  }

  async setUserAvatar(user: User, extension: string): Promise<void> {
    user.avatar = await `http://${process.env.HOST_DOMAIN}:${process.env.HOST_PORT}/assets/profiles/${(await user.userID)}.${extension}`;
    await this.save(user);
  }

  async getUserachievementListByUser(user: User): Promise<UserAchievementlistDto[]> {
    const achlist: UserAchievementlistDto[] = [];
    for (let i: number = 0; i < 10; i++) {
      const tmpach = {
        id: (await user.userAchievements[i].achievement).id,
        title: (await user.userAchievements[i].achievement).name,
        description: (await user.userAchievements[i].achievement).description,
        isAchieved: await user.userAchievements[i].isAchieved,
      };
      achlist.push(tmpach);
    }
    return achlist;
  }

  async getUserProfile(user: User): Promise<UserprofileUserDto> {
    const achlist: UserAchievementlistDto[] = [];
    for (let i = 0; i < 10; i++) {
      const tmpinfo = {
        id: user.userAchievements[i].achievement.id,
        title: user.userAchievements[i].achievement.name,
        description: user.userAchievements[i].achievement.description,
        isAchieved: user.userAchievements[i].isAchieved,
      };
      achlist.push(tmpinfo);
    }
    const userinfo = {
      nickname: user.nickname,
      image: user.avatar,
      winCount: user.win,
      loseCount: user.lose,
      ladderPoint: user.point,
      achievements: achlist,
    };
    return userinfo;
  }

  async succesachievement(user: User, id: number): Promise<User> {
    const userchieve = await this.userAchievementRepository.setuserachievementsuccess(user, id);
    userchieve.isAchieved = true;
    await this.save(user);
    return user;
  }

  async setAchievement(User: User): Promise<UserAchievement[]> {
    const retlist: UserAchievement[] = [];
    for (let i = 0; i < 10; i++) {
      retlist.push(await this.userAchievementRepository.createuserachievement(User, i));
    }
    return retlist;
  }

  async getAchivements(user: User): Promise<User> {
    //도전과제 생성됐는지 검사
    if (!user.userAchievements || user.userAchievements.length === 0) {
      user.userAchievements = await this.setAchievement(user);
    }
    if (user.win >= 1 || user.lose >= 1) await this.succesachievement(user, Achievements.FIRSTGAME);
    if (user.win >= 1) await this.succesachievement(user, Achievements.FIRSTWIN);
    return user;
  }

  async changeStatus(nickname: string, status: UserStatus) {
    const createduser = await this.getUserByNickname(nickname);
    createduser.status = status;
    await this.save(createduser);
  }

	async updateUserStatus(user: User, status: UserStatus): Promise<User> {
		user.status = status;

		const result = await this.save(user);
		return (result);
	}

	async saveOtpAuthSecret(user: User, secret: string): Promise<User> {
		user.otpAuthSecret = secret;

		const result = await this.save(user);
		return (result);
	}

	async turnOnOtp(user: User): Promise<User> {
		user.isActiveOtp = true;

		const result = await this.save(user);
		return (result);
	}

	async removeOtpAuthSecret(user: User): Promise<User> {
		user.otpAuthSecret = null;
		user.isActiveOtp = false;

		const result = await this.save(user);
		return (result);
	}
}
