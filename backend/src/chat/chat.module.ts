import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
})
export class ChatModule {}
