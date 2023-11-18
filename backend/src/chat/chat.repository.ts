import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { Chat } from "./entities/chat.entity";

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
			user,
			channel
		})

		const result = await this.save(chat);

		return (result);
	}
}
