import { DataSource, Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChannelRepository extends Repository<Channel> {
	constructor(private dataSource: DataSource) {
		super(Channel, dataSource.createEntityManager());
	}

	async getAllChannels(): Promise<Channel[]> {
		return (await this.find());
	}

	async createChennel(createChannelDto: CreateChannelDto): Promise<Channel> {
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
}
