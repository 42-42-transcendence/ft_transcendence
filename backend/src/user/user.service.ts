import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(private userRepository: UserRepository) {}

	async getJoinChannels(userID: string): Promise<ChannelMember[]> {
		return (this.userRepository.getJoinChannels(userID));
	}

	async getUserByNickname(nickname: string): Promise<User> {
		const user = this.userRepository.getUserByNickname(nickname);

		if (!user) {
			throw new NotFoundException(`${nickname}을 가진 유저를 찾을 수 없습니다.`);
		}

		return (user);
	}
}
