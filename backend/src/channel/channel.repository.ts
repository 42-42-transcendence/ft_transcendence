import { DataSource, Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { ChannelDto } from "./dto/channel.dto";
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

	async createChannel(createChannelDto: ChannelDto): Promise<Channel> {
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
		return (await this.findOneBy({ channelID }));
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

		if (!channel)
			throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);

		return (await channel.channelMembers);
	}

	async updateChannelInfo(channel: Channel, updateChannelDto: ChannelDto): Promise<Channel> {
		channel.title = updateChannelDto.title;
		channel.password = updateChannelDto.password;
		channel.type = updateChannelDto.type;

		const updateChannel = await this.save(channel);
		return (updateChannel);
	}
}
