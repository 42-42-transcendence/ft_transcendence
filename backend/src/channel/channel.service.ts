import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelDto } from './dto/channel.dto';
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

  async getPublicChannels(): Promise<Channel[]> {
		return (await this.channelRepository.getPublicChannels());
	}

  async createChannel(createChannelDto: ChannelDto): Promise<Channel> {
    return (await this.channelRepository.createChannel(createChannelDto));
  }

  async getChannelByTitleFromDM(title: string): Promise<Channel> {
		return (await this.channelRepository.getChannelByTitleFromDM(title));
	}

	async getChannelByTitleFromNotDM(title: string): Promise<Channel> {
		return (await this.channelRepository.getChannelByTitleFromNotDM(title));
	}

  async getChannelById(channelID: string): Promise<Channel> {
    return (await this.channelRepository.getChannelById(channelID));
  }

  async getChannelByIdWithException(channelID: string): Promise<Channel> {
    const channel = await this.channelRepository.getChannelById(channelID);

    if (!channel)
      throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${channelID}`);

    return (channel);
  }

  async deleteChannelById(channelID: string): Promise<void> {
    await this.channelRepository.deleteChannelById(channelID);
  }

  async createChannelDummy() {
    await this.channelRepository.createChannelDummy();
  }

  async getJoinChannelMembers(channelID: string): Promise<ChannelMember[]> {
    return (await this.channelRepository.getJoinChannelMembers(channelID));
  }

  async updateChannelInfo(channel: Channel, updateChannelDto: ChannelDto): Promise<Channel> {
    return (await this.channelRepository.updateChannelInfo(channel, updateChannelDto));
  }

  async enterUserToChannel(channel: Channel): Promise<Channel> {
		return (await this.channelRepository.enterUserToChannel(channel));
	}

	async leaveUserToChannel(channel: Channel): Promise<Channel> {
		return (await this.channelRepository.leaveUserToChannel(channel));
	}

}
