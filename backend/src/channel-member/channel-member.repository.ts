import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ChannelMember } from "./entities/channel-member.entity";
import { ChannelMemberDto } from "./dto/channel-member.dto";
import { ChannelMemberRole } from "./enums/channel-member-role.enum";

@Injectable()
export class ChannelMemberRepository extends Repository<ChannelMember> {
	constructor(private dataSource: DataSource) {
		super(ChannelMember, dataSource.createEntityManager());
	}

	async relationChannelMember(channelMemberDto: ChannelMemberDto): Promise<ChannelMember> {
		const { channel, user, role } = channelMemberDto;

		const channelMember = this.create({
			channel,
			user,
			role
		})

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
}
