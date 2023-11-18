import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { ChannelRepository } from './channel.repository';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { User } from 'src/user/entities/user.entity';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChannelService {
  constructor(private channelRepository: ChannelRepository) {}

  async getAllChannels(): Promise<Channel[]> {
    return (await this.channelRepository.getAllChannels());
  }

  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    return (this.channelRepository.createChannel(createChannelDto));
  }

  async getChannelById(channelID: string): Promise<Channel> {
    return (this.channelRepository.getChannelById(channelID));
  }

  async getChannelAllInfo(channelID: string): Promise<Channel> {
    const channel = await this.getChannelById(channelID);

    if (!channel)
      throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);

    await channel.channelMembers;
    await channel.chats;

    return (channel);
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

  async joinChannel(user: User, channelID: string) {

  }

}
