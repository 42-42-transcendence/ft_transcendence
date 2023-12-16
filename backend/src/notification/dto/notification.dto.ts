import { User } from "src/user/entities/user.entity";
import { NotiType } from "../enums/noti-type.enum";

export class NotificationDto {

    message: string;

    notiType: NotiType;

    user: User;
}