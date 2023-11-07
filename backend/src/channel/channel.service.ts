import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { ChannelRepository } from './channel.repository';

@Injectable()
export class ChannelService {
  constructor(private channelRepository: ChannelRepository) {}

  getAllChannels(): Promise<Channel[]> {
    return (this.channelRepository.getAllChannels());
  }

  createChennel(createChannelDto: CreateChannelDto): Promise<Channel> {
    return (this.channelRepository.createChennel(createChannelDto));
  }

  getChannelById(id: number): Promise<Channel> {
    return (this.channelRepository.getChannelById(id));
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
