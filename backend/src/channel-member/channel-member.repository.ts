import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ChannelMember } from "./entities/channel-member.entity";
import { RelationChannelMemberDto } from "./dto/relation-channel-member.dto";

@Injectable()
export class ChannelMemberRepository extends Repository<ChannelMember> {
	constructor(private dataSource: DataSource) {
		super(ChannelMember, dataSource.createEntityManager());
	}

	async relationChannelMember(relationChannelMemberDto: RelationChannelMemberDto): Promise<ChannelMember> {
		const { channel, user, role } = relationChannelMemberDto;

		const channelMember = this.create({
			channel,
			user,
			role
		})

		const result = await this.save(channelMember);
		return (result);
	}
}
