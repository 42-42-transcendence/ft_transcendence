import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelMemberDto } from './dto/channel-member.dto';
import { ChannelMemberRepository } from './channel-member.repository';
import { Channel } from 'src/channel/entities/channel.entity';
import { User } from 'src/user/entities/user.entity';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelMemberRole } from './enums/channel-member-role.enum';

@Injectable()
export class ChannelMemberService {
  constructor(private channelMemberRepository: ChannelMemberRepository) {}

  async relationChannelMember(ChannelMemberDto: ChannelMemberDto) {
    return (this.channelMemberRepository.relationChannelMember(ChannelMemberDto));
  }

  async getChannelMemberByChannelUser(channel: Channel, user: User): Promise<ChannelMember> {
    const members = await channel.channelMembers;
    const member = members.find(member => member.user.userID = user.userID);

    return (member);
  }

  async updateChannelMemberRole(channelMemberDto: ChannelMemberDto): Promise<ChannelMember> {
    const { channel, user, role } = channelMemberDto;
    const member = await this.getChannelMemberByChannelUser(channel, user);

    if (!member)
      throw new NotFoundException('없는 channel-member 관계입니다.');

    return (this.channelMemberRepository.updateChannelMemberRole(member, role));
  }

  async deleteChannelMember(channel: Channel, user: User) {
    const member = await this.getChannelMemberByChannelUser(channel, user);

    if (!member)
      throw new NotFoundException('없는 channel-member 관계입니다.');

    this.channelMemberRepository.deleteChannelMember(member.channelMemberID);
  }
}
