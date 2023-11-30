import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(private userRepository: UserRepository) {}

	async getJoinChannels(userID: string): Promise<ChannelMember[]> {
		return (this.userRepository.getJoinChannels(userID));
	}

	async createUserDummy(): Promise<User> {
		return (this.userRepository.createUserDummy());
	}
}
