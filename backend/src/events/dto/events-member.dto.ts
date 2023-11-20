import { ChannelMemberRole } from "src/channel-member/enums/channel-member-role.enum";

export class EventsMemberDto {
    
    userID: string;

    image: string;

    relation: string;

    role: ChannelMemberRole;

    isMuted: boolean;
}