import { Channel } from "src/channel/entities/channel.entity";
import { User } from "src/user/entities/user.entity";
import { ChannelMemberRole } from "../enums/channel-member-role.enum";

export class RelationChannelMemberDto {

	channel: Channel;

	user: User;

	role: ChannelMemberRole;

}
