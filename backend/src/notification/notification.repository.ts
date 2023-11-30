import { Injectable, NotFoundException } from "@nestjs/common";
import { Notification } from "./entities/notification.entity";
import { DataSource, Repository } from "typeorm";
import { NotificationDto } from "./dto/notification.dto";
import { NotificationWithDataDto } from "./dto/notification-with-data.dto";
import { NotiType } from "./enums/noti-type.enum";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class NotificationRepository extends Repository<Notification> {
    constructor(private dataSource: DataSource) {
        super(Notification, dataSource.createEntityManager());
    }

    async getAllNotiByUserID(userID: string): Promise<Notification[]> {
        const notifications = await this
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user', 'user')
            .where('user.userID = :userID', { userID })
            .getMany();

        return (notifications);
    }

    async createNotification(notificationDto: NotificationDto): Promise<Notification> {
        const noti = this.create({
            message: notificationDto.message,
            notiType: notificationDto.notiType,
            user: notificationDto.user
        });

        const result = await this.save(noti);

        return (result);
    }

    async createNotificationWithData(notificationWithDataDto: NotificationWithDataDto): Promise<Notification> {
        const noti = this.create({
            message: notificationWithDataDto.message,
            notiType: notificationWithDataDto.notiType,
            user: notificationWithDataDto.user,
            data: notificationWithDataDto.data,
        });

        const result = await this.save(noti);

        return (result);
    }

    async deleteNotification(notificationID: string) {
        const result = await this.delete(notificationID);

		if (result.affected === 0)
			throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${notificationID}`);
    }

    async deleteAllGameNotiByUserID(userID: string) {
        const result = await this
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user', 'user')
            .delete()
            .from(Notification)
            .where('user.userID = :userID', { userID })
            .andWhere('notification.notiType = :notiType', { notiType: NotiType.GAME})
            .execute();
    }

    async getGameNotiByInvitedUserAndSendUserNickname(
        invitedUser: User, sendUserNickname: string
    ): Promise<Notification> {
        const noti = await this
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user', 'user')
            .where('user.userID = :userID', { userID: invitedUser.userID })
            .andWhere('notification.data = :nickname', { nickname: sendUserNickname })
            .getOne();

        return (noti);
    }
}
