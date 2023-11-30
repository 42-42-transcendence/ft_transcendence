import { Injectable, NotFoundException } from "@nestjs/common";
import { Notification } from "./entities/notification.entity";
import { DataSource, Repository } from "typeorm";
import { NotificationDto } from "./dto/notification.dto";
import { NotificationWithChannelIDDto } from "./dto/notification-with-channelID.dto";

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

    async createNotificationWithData(notificationWithChannelIDDto: NotificationWithChannelIDDto): Promise<Notification> {
        const noti = this.create({
            message: notificationWithChannelIDDto.message,
            notiType: notificationWithChannelIDDto.notiType,
            user: notificationWithChannelIDDto.user,
            data: notificationWithChannelIDDto.data,
        });

        const result = await this.save(noti);

        return (result);
    }

    async deleteNotification(notificationID: string) {
        const result = await this.delete(notificationID);

		if (result.affected === 0)
			throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${notificationID}`);
    }
}
