import { Module } from '@nestjs/common';
import { ChannelMemberService } from './channel-member.service';
import { ChannelMemberRepository } from './channel-member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channel-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember])],
  providers: [ChannelMemberService, ChannelMemberRepository],
  exports: [ChannelMemberService, ChannelMemberRepository]
})
export class ChannelMemberModule {}
