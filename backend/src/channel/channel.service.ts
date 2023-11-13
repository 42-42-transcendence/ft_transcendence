import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { ChannelRepository } from './channel.repository';

@Injectable()
export class ChannelService {
  constructor(private channelRepository: ChannelRepository) {}

  async getAllChannels(): Promise<Channel[]> {
    return (await this.channelRepository.getAllChannels());
  }

  createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    return (this.channelRepository.createChannel(createChannelDto));
  }

  getChannelById(id: number): Promise<Channel> {
    return (this.channelRepository.getChannelById(id));
  }

  async deleteChannelById(id: number): Promise<void> {
    await this.channelRepository.deleteChannelById(id);
  }

  async createDummy() {
    await this.channelRepository.createDummy();
  }


}
