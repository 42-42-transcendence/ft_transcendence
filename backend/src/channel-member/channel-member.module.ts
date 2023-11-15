import { Module } from '@nestjs/common';
import { ChannelMemberService } from './channel-member.service';
import { ChannelMemberController } from './channel-member.controller';
import { ChannelMemberRepository } from './channel-member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './entities/channel-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember])],
  controllers: [ChannelMemberController],
  providers: [ChannelMemberService, ChannelMemberRepository],
  exports: [ChannelMemberService, ChannelMemberRepository]
})
export class ChannelMemberModule {}
