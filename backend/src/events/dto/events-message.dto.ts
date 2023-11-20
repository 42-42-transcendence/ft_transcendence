import { ChatType } from "src/chat/enums/chat-type.enum";

export class EventsMessageDto {

    chatID: string;

    nickname: string;

    type: ChatType;

    content: string;

    date: Date;
}