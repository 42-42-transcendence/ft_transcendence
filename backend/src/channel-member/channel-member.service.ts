import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelMemberDto } from './dto/channel-member.dto';
import { ChannelMemberRepository } from './channel-member.repository';
import { Channel } from 'src/channel/entities/channel.entity';
import { User } from 'src/user/entities/user.entity';
import { ChannelMember } from './entities/channel-member.entity';
import { ChannelMemberRole } from './enums/channel-member-role.enum';
import { ChannelTypeEnum } from 'src/channel/enums/channelType.enum';

@Injectable()
export class ChannelMemberService {
  constructor(private channelMemberRepository: ChannelMemberRepository) {}

  async relationChannelMember(ChannelMemberDto: ChannelMemberDto) {
    return (this.channelMemberRepository.relationChannelMember(ChannelMemberDto));
  }

  async getChannelMemberByChannelUser(channel: Channel, user: User): Promise<ChannelMember> {
    return (await this.channelMemberRepository.getChannelMemberByChannelUser(channel, user));
  }

  async getChannelMemberByChannelUserWithException(channel: Channel, user: User): Promise<ChannelMember> {
    const member = await this.channelMemberRepository.getChannelMemberByChannelUser(channel, user);

    if (!member)
      throw new NotFoundException('없는 channel-member 관계입니다.');

    return (member);
  }

  async checkChannelMember(channel: Channel, user: User): Promise<boolean> {
    const member = await this.getChannelMemberByChannelUser(channel, user);

    if (!member) {
      return (false);
    }
    return (true);
  }

  // 권한이 없으면 부여 가능하기도 해야해서 여기서 예외 던지면 안됨
  async hasAuthMemberToChannel(channel: Channel, user: User): Promise<boolean> {
    const member = await this.getChannelMemberByChannelUser(channel, user);

    if ((member.role !== ChannelMemberRole.OWNER) && (member.role !== ChannelMemberRole.STAFF)) {
      return (false);
    }
    return (true)
  }

  async updateChannelMemberRole(channelMemberDto: ChannelMemberDto): Promise<ChannelMember> {
    const { channel, user, role } = channelMemberDto;
    const member = await this.getChannelMemberByChannelUserWithException(channel, user);

    return (await this.channelMemberRepository.updateChannelMemberRole(member, role));
  }

  async updateChannelMemberRoleByChannelMember(
    member: ChannelMember, role: ChannelMemberRole
  ): Promise<ChannelMember> {
    return (await this.channelMemberRepository.updateChannelMemberRole(member, role));
  }

  async updateChannelMemberIsMutedByChannelMember(
    member: ChannelMember, isMuted: boolean
  ): Promise<ChannelMember> {
    return (await this.channelMemberRepository.updateChannMemberIsMuted(member, isMuted));
  }

  async deleteChannelMemberById(channelMemberID: string) {
    await this.channelMemberRepository.deleteChannelMember(channelMemberID);
  }

  async deleteChannelMember(channel: Channel, user: User) {
    const member = await this.getChannelMemberByChannelUserWithException(channel, user);

    await this.channelMemberRepository.deleteChannelMember(member.channelMemberID);
  }

  async getAllChannelMembers(): Promise<ChannelMember[]> {
    return (await this.channelMemberRepository.getAllChannelMembers());
  }

  async getChannelMembersWithUserFromChannel(channel: Channel): Promise<ChannelMember[]> {
    return (await this.channelMemberRepository.getChannelMembersWithUserFromChannel(channel));
  }

  async getChannelFromChannelMember(member: ChannelMember): Promise<Channel> {
		return (await this.channelMemberRepository.getChannelFromChannelMember(member));
	}

  async getUserFromChannelMember(member: ChannelMember): Promise<User> {
    return (await this.channelMemberRepository.getUserFromChannelMember(member));
	}

  async delegateChannelOwner(channel: Channel): Promise<ChannelMember> {
    const staff = await this.channelMemberRepository.findChannelStaff(channel);

    if (staff) {
      const newOwner = await this.channelMemberRepository.updateChannelMemberRole(staff, ChannelMemberRole.OWNER);
      return (newOwner);
    }

    const member = await this.channelMemberRepository.findChannelAnyMember(channel);
    const newOwner = await this.channelMemberRepository.updateChannelMemberRole(member, ChannelMemberRole.OWNER);
    return (newOwner);
  }

  async getPrivateChannelsByUser(user: User): Promise<Channel[]> {
		return (await this.channelMemberRepository.getPrivateChannelsByUser(user, ChannelTypeEnum.PRIVATE));
	}

  async getDmChannelsByUser(user: User): Promise<Channel[]> {
		return (await this.channelMemberRepository.getDmChannelsByUser(user, ChannelTypeEnum.DM));
	}

}
