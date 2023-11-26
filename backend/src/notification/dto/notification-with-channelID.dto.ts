import { User } from "src/user/entities/user.entity";
import { NotiType } from "../enums/noti-type.enum";

export class NotificationWithChannelIDDto {

    message: string;

    notiType: NotiType;

    user: User;

    channelID: string;
}