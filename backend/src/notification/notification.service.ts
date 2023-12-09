import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { Notification } from './entities/notification.entity';
import { NotificationDto } from './dto/notification.dto';
import { NotificationWithDataDto } from './dto/notification-with-data.dto';
import { User } from 'src/user/entities/user.entity';

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

    async createNotificationWithData(notificationWithDataDto: NotificationWithDataDto): Promise<Notification> {
        const result = await this.notificationRepository.createNotificationWithData(notificationWithDataDto);

        if (!result) {
            throw new BadRequestException('알림을 만들 수 없습니다.');
        }

        return (result);
    }

    async deleteNotification(notificationID: string) {
        await this.notificationRepository.deleteNotification(notificationID);
    }

    async deleteAllGameNotiByUserID(userID: string) {
        return (await this.notificationRepository.deleteAllGameNotiByUserID(userID));
    }

    async isSendGameNotiToInvitedUser(
        invitedUser: User, sendUserNickname: string
    ): Promise<boolean>{
        const noti = await this.notificationRepository
                            .getGameNotiByInvitedUserAndSendUserNickname(invitedUser, sendUserNickname);
        if (!noti) {
            return (false);
        }
        return (true);
    }

    async getGameNotiByInvitedUserAndSendUserNicknameWithException(
        invitedUser: User, sendUserNickname: string
    ): Promise<Notification>{
        const noti = await this.notificationRepository
                            .getGameNotiByInvitedUserAndSendUserNickname(invitedUser, sendUserNickname);
        if (!noti) {
            throw new BadRequestException(`해당하는 게임 초대를 받지 않았습니다.`);
        }
        return (noti);
    }

}
