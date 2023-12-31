import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatService, ChatRepository],
  exports: [ChatService, ChatRepository]
})
export class ChatModule {}
