import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ChannelMember } from "./entities/channel-member.entity";
import { ChannelMemberDto } from "./dto/channel-member.dto";
import { ChannelMemberRole } from "./enums/channel-member-role.enum";
import { Channel } from "src/channel/entities/channel.entity";
import { User } from "src/user/entities/user.entity";
import { ChannelTypeEnum } from "src/channel/enums/channelType.enum";

@Injectable()
export class ChannelMemberRepository extends Repository<ChannelMember> {
	constructor(private dataSource: DataSource) {
		super(ChannelMember, dataSource.createEntityManager());
	}

	async relationChannelMember(channelMemberDto: ChannelMemberDto): Promise<ChannelMember> {
		const { channel, user, role } = channelMemberDto;

		const channelMember = new ChannelMember();

		channelMember.channel = channel;
		channelMember.user = user;
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

	async updateChannMemberIsMuted(member: ChannelMember, isMuted: boolean): Promise<ChannelMember> {
		member.isMuted = isMuted;
		const result = await this.save(member);

		return (result);
	}

	async getAllChannelMembers(): Promise<ChannelMember[]> {
		return (await this.find());
	}

	async getChannelMembersWithUserFromChannel(channel: Channel): Promise<ChannelMember[]> {
		const members = await this
			.createQueryBuilder('member')
			.leftJoinAndSelect('member.channel', 'channel')
			.leftJoinAndSelect('member.user', 'user')
			.where('channel.channelID = :channelID', { channelID: channel.channelID })
			.getMany();

		return (members);
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

	async getChannelFromChannelMember(member: ChannelMember): Promise<Channel> {
		const memberWithChannel = await this.findOne({
			where: { channelMemberID: member.channelMemberID },
			relations: ['channel']
		});
		return (memberWithChannel.channel);
	}

	async getUserFromChannelMember(member: ChannelMember): Promise<User> {
		const result = await this
			.createQueryBuilder('member')
			.leftJoinAndSelect('member.user', 'user')
			.where('member.channelMemberID = :channelMemberID', { channelMemberID: member.channelMemberID })
			.getOne();
		return (result.user);
	}

	async findChannelStaff(channel: Channel): Promise<ChannelMember> {
		const member = await this
			.createQueryBuilder('member')
			.leftJoinAndSelect('member.channel', 'channel')
			.where('channel.channelID = :channelID', { channelID: channel.channelID })
			.andWhere('member.role = :role', { role: ChannelMemberRole.STAFF })
			.getOne();

		return (member);
	}

	async findChannelAnyMember(channel: Channel): Promise<ChannelMember> {
		const member = await this
			.createQueryBuilder('member')
			.leftJoinAndSelect('member.channel', 'channel')
			.where('channel.channelID = :channelID', { channelID: channel.channelID })
			.andWhere('member.role != :role', { role: ChannelMemberRole.OWNER })
			.getOne();

		return (member);
	}

	async getPrivateChannelsByUser(user: User, type: ChannelTypeEnum): Promise<Channel[]> {
		const channelMembers = await this
			.createQueryBuilder('member')
			.leftJoinAndSelect('member.user', 'user')
			.leftJoinAndSelect('member.channel', 'channel')
			.where('user.userID = :userID', { userID: user.userID })
			.andWhere('channel.type = :type', { type })
			.andWhere('member.role != :role', { role: ChannelMemberRole.BLOCK })
			.getMany();
		
		const channels: Channel[] = [];
		channelMembers.forEach(member => {
			channels.push(member.channel);
		});
		
		return (channels);
	}

	async getDmChannelsByUser(user: User, type: ChannelTypeEnum): Promise<Channel[]> {
		const channelMembers = await this
			.createQueryBuilder('member')
			.leftJoinAndSelect('member.user', 'user')
			.leftJoinAndSelect('member.channel', 'channel')
			.where('user.userID = :userID', { userID: user.userID })
			.andWhere('channel.type = :type', { type })
			.getMany();
		
		const channels: Channel[] = [];
		channelMembers.forEach(member => {
			channels.push(member.channel);
		});
		
		return (channels);
	}
}
