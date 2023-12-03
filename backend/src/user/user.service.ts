/* eslint-disable object-property-newline */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from './entities/user.entity';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserprofileUserDto } from './dto/userprofile-user.dto';
import { UserStatus } from './enums/user-status.enum';
import { AuthRepository } from 'src/auth/auth.repository';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authrepository: AuthRepository,
  ) {}

  async getJoinChannels(userID: string): Promise<ChannelMember[]> {
    return this.userRepository.getJoinChannels(userID);
  }

  // getUserByNickname('abc')
  //   .then((nickname) => {
  //     this.userRepository.getUserByNickname(nickname)
  //   }).then((user) => {
  //     ...
  //   })

  async getUserByNickname(nickname: string): Promise<User> {
    const user = await this.userRepository.getUserByNickname(nickname);

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
    return this.userRepository.createUser(nickname);
  }

  async relationAuthUser(user: User, auth: Auth) {
    return this.authrepository.relationAuthUser(auth, user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserProfile(user: User): Promise<UserprofileUserDto> {
    return this.userRepository.getUserProfile(user);
  }

  async getAchievements(User: User): Promise<User> {
    return this.userRepository.getAchivements(User);
  }

  async changeStatus(nickname: string, status: UserStatus) {
    this.userRepository.changeStatus(nickname, status);
    // const createduser = await this.getUserByNickname(nickname);
    // createduser.status = status;
    // await this.save(createduser);
  }
}
