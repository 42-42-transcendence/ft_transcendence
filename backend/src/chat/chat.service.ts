import { Injectable } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { Chat } from './entities/chat.entity';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async createChatMessage(createChatMessageDto: CreateChatMessageDto): Promise<Chat> {
    return (this.chatRepository.createChatMessage(createChatMessageDto));
  }
}
