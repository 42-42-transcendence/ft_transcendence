import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from './entities/user.entity';
import { RelationTypeEnum } from 'src/relation/enums/relation-type.enum';

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
}
