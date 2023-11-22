import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ChannelMember } from "./entities/channel-member.entity";
import { ChannelMemberDto } from "./dto/channel-member.dto";
import { ChannelMemberRole } from "./enums/channel-member-role.enum";
import { Channel } from "src/channel/entities/channel.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class ChannelMemberRepository extends Repository<ChannelMember> {
	constructor(private dataSource: DataSource) {
		super(ChannelMember, dataSource.createEntityManager());
	}

	async relationChannelMember(channelMemberDto: ChannelMemberDto): Promise<ChannelMember> {
		const { channel, user, role } = channelMemberDto;

		const channelMember = new ChannelMember();

		channelMember.channel = Promise.resolve(channel);
		channelMember.user = Promise.resolve(user);
		channelMember.role = role;

		const result = await this.save(channelMember);
		return (result);
	}

	async deleteChannelMember(channelMemberID: string) {
		const result = await this.delete(channelMemberID);

		if (result.affected === 0)
			throw new NotFoundException('없는 channel-member 관계입니다.');
	}

	async updateChannelMemberRole(member: ChannelMember, role: ChannelMemberRole): Promise<ChannelMember> {
		member.role = role;

		const result = await this.save(member);
		return (result);
	}

	async getAllChannelMembers(): Promise<ChannelMember[]> {
		return (await this.find());
	}

	async getChannelMemberByChannelUser(channel: Channel, user: User): Promise<ChannelMember> {
		const member = await this
			.createQueryBuilder('member')
			.leftJoinAndSelect('member.channel', 'channel')
			.leftJoinAndSelect('member.user', 'user')
			.where('user.userID = :userID', { userID: user.userID })
			.andWhere('channel.channelID = :channelID', { channelID: channel.channelID })
			.getOne();

		return (member);
	}
}
