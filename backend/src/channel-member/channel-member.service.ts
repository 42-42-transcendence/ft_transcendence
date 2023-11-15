import { Injectable } from '@nestjs/common';
import { RelationChannelMemberDto } from './dto/relation-channel-member.dto';
import { ChannelMemberRepository } from './channel-member.repository';

@Injectable()
export class ChannelMemberService {
  constructor(private channelMemberRepository: ChannelMemberRepository) {}

  async relationChannelMember(relationChannelMemberDto: RelationChannelMemberDto) {
    return (this.channelMemberRepository.relationChannelMember(relationChannelMemberDto));
  }

}
