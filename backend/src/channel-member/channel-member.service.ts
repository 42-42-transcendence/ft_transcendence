import { Injectable } from '@nestjs/common';
import { CreateChannelMemberDto } from './dto/create-channel-member.dto';
import { UpdateChannelMemberDto } from './dto/update-channel-member.dto';

@Injectable()
export class ChannelMemberService {
  create(createChannelMemberDto: CreateChannelMemberDto) {
    return 'This action adds a new channelMember';
  }

  findAll() {
    return `This action returns all channelMember`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channelMember`;
  }

  update(id: number, updateChannelMemberDto: UpdateChannelMemberDto) {
    return `This action updates a #${id} channelMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} channelMember`;
  }
}
