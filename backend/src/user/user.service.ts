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
import * as fs from 'fs/promises';
import * as path from 'path';
import { UserAchievementModule } from 'src/user-achievement/user-achievement.module';
import { SocketException } from 'src/events/socket.exception';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authrepository: AuthRepository,
  ) {}

	async getJoinChannels(userID: string): Promise<ChannelMember[]> {
		return (this.userRepository.getJoinChannels(userID));
	}


	async getUserByNickname(nickname: string): Promise<User> {
		return (await this.userRepository.getUserByNickname(nickname));
	}

	async getUserByNicknameWithException(nickname: string): Promise<User> {
		const user = await this.userRepository.getUserByNickname(nickname);

	if (!user) {
		throw new NotFoundException(`${nickname}을 가진 유저를 찾을 수 없습니다.`);
	}

		return (user);
	}

	async getUserByNicknameWithWsException(nickname: string): Promise<User> {
		const user = await this.userRepository.getUserByNickname(nickname);

		if (!user) {
			throw new SocketException('NotFound', `${nickname}을 가진 유저를 찾을 수 없습니다.`);
		}

		return (user);
	}

	async getUserById(userID: string): Promise<User> {
		return (await this.userRepository.getUserById(userID));
	}

	async getUserByIdWithException(userID: string): Promise<User> {
		const user = await this.userRepository.getUserById(userID);

		if (!user) {
			throw new NotFoundException(`${userID}를 찾을 수 없습니다.`);
		}

		return (user);
	}

	async getUserByIdWithWsException(userID: string): Promise<User> {
		const user = await this.userRepository.getUserById(userID);

		if (!user) {
			throw new SocketException('NotFound', `${userID}을 가진 유저를 찾을 수 없습니다.`);
		}

		return (user);
	}

	async createUserDummy(): Promise<User> {
		return this.userRepository.createUserDummy();
	}
	
	async createUser(nickname: string): Promise<User> {
		return await this.userRepository.createUser(nickname);
	}
	
	async createNicknameUser(userID: string, auth: Auth): Promise<{ message: string }> {
		// assests/profiles/authUID.png
		// ㄴ 만약 authUID가 있는지는, 어차피 writeFile은 덮어씌움
		// user 객체가 이미 있으면, 그냥 return?
		// image size, image 확장자 검사 한 번 더
		// nickname 중복검사
		const user = await this.userRepository.getUserByNickname(userID);
		if (user) {
		throw new NotFoundException(`${userID}를 가진 유저가 이미 있습니다.`);
		}
		const createdUser = await this.userRepository.createUser(userID);
		await this.authrepository.relationAuthUser(auth, createdUser);
		console.log('-------------- user db saved --------------');
		const ret = { message: 'user db saved' };
		return ret;
	}
  
	async createImageUser(file: Express.Multer.File, auth: Auth): Promise<{ message: string }> {
		console.log(file);
		const authuid = auth.intraUID; // image size, image 확장자 검사 한 번 더 필요
		const extension = file.originalname.split('.').pop();
		const filePath = path.join(__dirname, `../../assets/profiles/${authuid}.${extension}`);
		await fs.writeFile(filePath, file.buffer);
		await this.userRepository.setUserAvatar(await auth.user, extension);
		console.log('-------------- file saved --------------');

		const ret = { message: 'file saved' };
		return ret;
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

	async getAllUsers(): Promise<User[]> {
		return (await this.userRepository.getAllUsers());
	}

	async updateUserStatus(user: User, status: UserStatus): Promise<User> {
		return (await this.userRepository.updateUserStatus(user, status));
	}

	async saveOtpAuthSecret(user: User, secret: string): Promise<User> {
		return (await this.userRepository.saveOtpAuthSecret(user, secret));
	}

	async turnOnOtp(user: User): Promise<User> {
		return (await this.userRepository.turnOnOtp(user));
	}

	async removeOtpAuthSecret(user: User): Promise<User> {
		return (await this.userRepository.removeOtpAuthSecret(user));
	}

}
