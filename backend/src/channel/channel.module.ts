import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelRepository } from './channel.repository';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel])
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepository, JwtStrategy, PassportModule],
})
export class ChannelModule {}
