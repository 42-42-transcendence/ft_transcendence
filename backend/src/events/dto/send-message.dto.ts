import { Length } from "class-validator";

export class SendMessageDto {
    channelID: string;

    @Length(1, 50)
    message: string;
}