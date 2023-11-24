import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('NOTIFICATION')
@Controller('api/notification')
@UseGuards(AuthGuard())
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Delete(':id')
  async deleteNotification(
    @Param('id') notificationID: string,
  ): Promise<{ message: string }> {
    await this.notificationService.deleteNotification(notificationID);

    return ({ message: '알림을 삭제했습니다.'});
  }
}
