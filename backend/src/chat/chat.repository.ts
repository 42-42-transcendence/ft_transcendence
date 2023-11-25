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

	async getAllChats(): Promise<Chat[]> {
		return (await this.find());
	}

	async createChatMessage(createChatMessageDto: CreateChatMessageDto): Promise<Chat> {
		const chat = this.create({
			content: createChatMessageDto.content,
			chatType: createChatMessageDto.chatType,
			userNickname: createChatMessageDto.userNickname,
			user: createChatMessageDto.user,
			channel: createChatMessageDto.channel,
		})

		const result = await this.save(chat);
		return (result);
	}

	createMuteMessage(user: User, channel: Channel): Chat {
		const message = this.create({
			content: `${user.nickname}님은 현재 뮤트상태입니다.`,
			chatType: ChatType.SYSTEM,
			userNickname: user.nickname,
			user,
			channel
		})
		return (message);
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
