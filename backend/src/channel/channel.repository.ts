import { DataSource, Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { Injectable, NotFoundException } from "@nestjs/common";

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

	async getChannelById(id: number): Promise<Channel> {
		const channel = await this.findOneBy({id});

		if (!channel)
			throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${id}`);

		return (channel);
	}

	async deleteChannelById(id: number): Promise<void> {
		const result = await this.delete(id);

		if (result.affected === 0)
			throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${id}`);
	}
}
