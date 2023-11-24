import { Injectable, NotFoundException } from "@nestjs/common";
import { Notification } from "./entities/notification.entity";
import { DataSource, Repository } from "typeorm";
import { NotificationDto } from "./dto/notification.dto";

@Injectable()
export class NotificationRepository extends Repository<Notification> {
    constructor(private dataSource: DataSource) {
        super(Notification, dataSource.createEntityManager());
    }

    async getAllNotiFromNickname(userNickname: string): Promise<Notification[]> {
        const notifications = await this
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user', 'user')
            .where('user.nickname = :nickname', { nickname: userNickname })
            .getMany();

        return (notifications);
    }

    async createNotification(notificationDto: NotificationDto): Promise<Notification> {
        const result = this.create({
            message: notificationDto.message,
            notiType: notificationDto.notiType,
            user: notificationDto.user
        });
        
        return (result);
    }

    async deleteNotification(notificationID: string) {
        const result = await this.delete(notificationID);

		if (result.affected === 0)
			throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${notificationID}`);
    }
}