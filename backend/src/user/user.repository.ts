import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { ChannelMember } from "src/channel-member/entities/channel-member.entity";

@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async createUser(name: string):Promise<User> {
		const user = this.create({
			nickname: name
		})
		const result = await this.save(user);

		return (result);
	}

	async getUserById(userID: string): Promise<User> {
		const user = await this.findOneBy({ userID });

		if (!user)
			throw new NotFoundException(`해당 user를 찾을 수 없습니다: ${userID}`);
		return (user);
	}

	async getJoinChannels(userID: string): Promise<ChannelMember[]> {
		const user = await this.getUserById(userID);

		return (await user.channelMembers);
	}
}
