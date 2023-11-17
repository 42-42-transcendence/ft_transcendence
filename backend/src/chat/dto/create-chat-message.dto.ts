
import { Channel } from "src/channel/entities/channel.entity";
import { User } from "src/user/entities/user.entity";

export class CreateChatMessageDto {

	content: string;

	user: User;

	channel: Channel;

}
