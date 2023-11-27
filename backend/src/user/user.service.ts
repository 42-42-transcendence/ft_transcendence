/* eslint-disable object-property-newline */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from './entities/user.entity';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UerprofileUserDto } from './dto/userprofile-user.dto';
import { UserAchievementRepository } from 'src/user-achievement/user-achievement.repository';
import { achievements, Achievements } from 'src/achievement/achievement';
import { UserStatus } from './enums/user-status.enum';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userachivementRepository: UserAchievementRepository,
  ) {}

  async getJoinChannels(userID: string): Promise<ChannelMember[]> {
    return this.userRepository.getJoinChannels(userID);
  }

  async getUserByNickname(nickname: string): Promise<User> {
    const user = this.userRepository.getUserByNickname(nickname);

    if (!user) {
      throw new NotFoundException(`${nickname}을 가진 유저를 찾을 수 없습니다.`);
    }

    return user;
  }

  async getUserById(userID: string): Promise<User> {
    return this.userRepository.getUserById(userID);
  }

  async getUserByIdWithException(userID: string) {
    const user = this.userRepository.getUserById(userID);

    if (!user) {
      throw new NotFoundException(`${userID}를 찾을 수 없습니다.`);
    }

    return user;
  }

  // async getBlockedList(user: User): Promise<string[]> {
  // 	const relations = await user.objectRelations;
  // 	let blockedList: string[] = [];

  // 	relations.forEach(async relation => {
  // 		if (relation.relationType === RelationTypeEnum.BLOCK) {
  // 			const user = await relation.subjectUser;
  // 			blockedList.push(user.nickname);
  // 		}
  // 	});
  // 	return (blockedList);
  // }

  async createUserDummy(): Promise<User> {
    return this.userRepository.createUserDummy();
  }

  async createUser(nickname: string): Promise<User> {
    return this.userRepository.createUser_default(nickname);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserProfile(nickname: string): Promise<UerprofileUserDto> {
    return this.userRepository.getUserProfile(nickname);
  }

  async getAchievements(nickname: string) {
    this.userRepository.getAchivements(nickname);
  }

  async changeStatus(nickname: string, status: UserStatus) {
    this.userRepository.changeStatus(nickname, status);
    // const createduser = await this.getUserByNickname(nickname);
    // createduser.status = status;
    // await this.save(createduser);
  }
}
