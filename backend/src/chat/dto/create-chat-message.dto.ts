
import { Channel } from "src/channel/entities/channel.entity";
import { User } from "src/user/entities/user.entity";
import { ChatType } from "../enums/chat-type.enum";

export class CreateChatMessageDto {

	content: string;

	chatType: ChatType;

	user: User;

	channel: Channel;

}
