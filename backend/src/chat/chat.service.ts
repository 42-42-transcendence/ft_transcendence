import { Injectable } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { Chat } from './entities/chat.entity';
import { ChatRepository } from './chat.repository';
import { Channel } from 'src/channel/entities/channel.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(private chatRepository: ChatRepository) {}

  async getAllChats(): Promise<Chat[]> {
    return (await this.chatRepository.getAllChats());
  }

  async createChatMessage(createChatMessageDto: CreateChatMessageDto): Promise<Chat> {
    return (this.chatRepository.createChatMessage(createChatMessageDto));
  }

  async createChatDummy(channel: Channel, user: User) {
    await this.chatRepository.createChatDummy(channel, user);
  }
}
