import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { Notification } from './entities/notification.entity';
import { NotificationDto } from './dto/notification.dto';
import { NotificationWithChannelIDDto } from './dto/notification-with-channelID.dto';

@Injectable()
export class NotificationService {
    constructor(private notificationRepository: NotificationRepository) {}

    async getAllNotiByUserID(userID: string): Promise<Notification[]> {
        return (await this.notificationRepository.getAllNotiByUserID(userID));
    }

    async createNotification(notificationDto: NotificationDto): Promise<Notification> {
        const result = await this.notificationRepository.createNotification(notificationDto);

        if (!result) {
            throw new BadRequestException('알림을 만들 수 없습니다.');
        }
        
        return (result);
    }

    async createNotificationWithChannelID(notificationWithChannelIDDto: NotificationWithChannelIDDto): Promise<Notification> {
        const result = await this.notificationRepository.createNotificationWithChannelID(notificationWithChannelIDDto);

        if (!result) {
            throw new BadRequestException('알림을 만들 수 없습니다.');
        }
        
        return (result);
    }

    async deleteNotification(notificationID: string) {
        await this.notificationRepository.deleteNotification(notificationID);
    }
}
