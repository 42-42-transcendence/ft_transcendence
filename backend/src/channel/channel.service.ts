import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { ChannelRepository } from './channel.repository';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';

@Injectable()
export class ChannelService {
  constructor(private channelRepository: ChannelRepository) {}

  async getAllChannels(): Promise<Channel[]> {
    return (await this.channelRepository.getAllChannels());
  }

  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    return (this.channelRepository.createChannel(createChannelDto));
  }

  getChannelById(channelID: string): Promise<Channel> {
    return (this.channelRepository.getChannelById(channelID));
  }

  async deleteChannelById(channelID: string): Promise<void> {
    await this.channelRepository.deleteChannelById(channelID);
  }

  async createDummy() {
    await this.channelRepository.createDummy();
  }

  async getJoinChannelMembers(channelID: string): Promise<ChannelMember[]> {
    return (this.channelRepository.getJoinChannelMembers(channelID));
  }

}
