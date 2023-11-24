import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { Notification } from './entities/notification.entity';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
    constructor(private notificationRepository: NotificationRepository) {}

    async getAllNotiFromNickname(userNickname: string): Promise<Notification[]> {
        return (await this.notificationRepository.getAllNotiFromNickname(userNickname));
    }

    async createNotification(notificationDto: NotificationDto): Promise<Notification> {
        const result = this.notificationRepository.createNotification(notificationDto);

        if (!result) {
            throw new BadRequestException('알림을 만들 수 없습니다.');
        }
        
        return (result);
    }

    async deleteNotification(notificationID: string) {
        await this.notificationRepository.deleteNotification(notificationID);
    }
}
