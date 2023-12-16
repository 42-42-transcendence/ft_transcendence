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
  
  async getRecentHundredChatsByChannelID(channelID: string): Promise<Chat[]> {
		return (this.chatRepository.getRecentHundredChatsByChannelID(channelID));
	}

  async createChatMessage(createChatMessageDto: CreateChatMessageDto): Promise<Chat> {
    return (await this.chatRepository.createChatMessage(createChatMessageDto));
  }

  createMuteMessage(user: User, channel: Channel): Chat {
    return (this.chatRepository.createMuteMessage(user, channel));
  }

  async createChatDummy(channel: Channel, user: User) {
    await this.chatRepository.createChatDummy(channel, user);
  }
}
