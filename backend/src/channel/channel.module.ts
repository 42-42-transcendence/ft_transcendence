import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelRepository } from './channel.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelMemberRepository } from 'src/channel-member/channel-member.repository';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    AuthModule
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    ChannelRepository,
    ChannelMemberService,
    ChannelMemberRepository
  ],
})
export class ChannelModule {}
