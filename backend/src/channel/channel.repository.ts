import { DataSource, Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { ChannelDto } from "./dto/channel.dto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { ChannelTypeEnum } from "./enums/channelType.enum";
import { ChannelMember } from "src/channel-member/entities/channel-member.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelRepository extends Repository<Channel> {
	constructor(private dataSource: DataSource) {
		super(Channel, dataSource.createEntityManager());
	}

	async getAllChannels(): Promise<Channel[]> {
		return (await this.find());
	}

	async getPublicChannels(): Promise<Channel[]> {
		const channels = await this
			.createQueryBuilder('channel')
			.where('channel.type = :type', { type: ChannelTypeEnum.PUBLIC })
			.getMany();

		return (channels);
	}

	async createChannel(createChannelDto: ChannelDto): Promise<Channel> {
		const title = createChannelDto.title;
		var password: string = '';
		if (createChannelDto.password !== '') {
			password = await bcrypt.hash(createChannelDto.password, 10);
		}

		const existedChannel = await this.findOneBy({ title });
		if (existedChannel) {
			throw new BadRequestException(`${title}채널이 이미 존재합니다.`);
		}

		const channel = this.create({
			title,
			password,
			type: createChannelDto.type
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

	async createChannelDummy() {
		const dummy = this.create({
			title: faker.company.name(),
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

	async enterUserToChannel(channel: Channel): Promise<Channel> {
		channel.total = channel.total + 1;
		const updateChannel = await this.save(channel);
		return (updateChannel);
	}

	async leaveUserToChannel(channel: Channel): Promise<Channel> {
		channel.total = channel.total - 1;
		const updateChannel = await this.save(channel);
		return (updateChannel);
	}

}
