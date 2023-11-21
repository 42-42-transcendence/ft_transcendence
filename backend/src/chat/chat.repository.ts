import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { Chat } from "./entities/chat.entity";

import { User } from "src/user/entities/user.entity";
import { faker } from "@faker-js/faker";
import { ChatType } from "./enums/chat-type.enum";
import { Channel } from "src/channel/entities/channel.entity";

@Injectable()
export class ChatRepository extends Repository<Chat> {
	constructor(private dataSource: DataSource) {
		super(Chat, dataSource.createEntityManager());
	}

	async createChatMessage(createChatMessageDto: CreateChatMessageDto): Promise<Chat> {
		const { content, chatType, user, channel } = createChatMessageDto;

		const chat = this.create({
			content,
			chatType,
			userNickname: user.nickname,
			user,
			channel
		})

		const result = await this.save(chat);

		return (result);
	}

	async createChatDummy(channel: Channel, user: User) {

		const dummy = this.create({
			content: faker.lorem.lines(1),
			chatType: ChatType.NORMAL,
			userNickname: user.nickname,
			channel,
			user,
		});

		await this.save(dummy);
	}
}
