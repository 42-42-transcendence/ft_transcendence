import { DataSource, Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { ChannelTypeEnum } from "./enums/channelType.enum";
import { ChannelMember } from "src/channel-member/entities/channel-member.entity";

@Injectable()
export class ChannelRepository extends Repository<Channel> {
	constructor(private dataSource: DataSource) {
		super(Channel, dataSource.createEntityManager());
	}

	async getAllChannels(): Promise<Channel[]> {
		return (await this.find());
	}

	async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
		const { title, password, type } = createChannelDto;

		const channel = this.create({
			title,
			total: 1,
			password,
			type
		});

		await this.save(channel);
		return (channel);
	}

	async getChannelById(channelID: string): Promise<Channel> {
		const channel = await this.findOneBy({ channelID });

		if (!channel)
			throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);

		return (channel);
	}

	async deleteChannelById(channelID: string): Promise<void> {
		const result = await this.delete(channelID);

		if (result.affected === 0)
			throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);
	}

	async createDummy() {
		const dummy = this.create({
			title: faker.company.name(),
			total: faker.number.int({ min: 1, max: 10 }),
			password: '',
			type: ChannelTypeEnum.PUBLIC
		})
		await this.save(dummy);
	}

	async getJoinChannelMembers(channelID: string): Promise<ChannelMember[]> {
		const channel = await this.getChannelById(channelID);

		return (await channel.channelMembers);
	}
}
