import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Channel } from './entities/channel.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('CHANNEL')
@Controller('api/channel')
@UseGuards(AuthGuard())
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // 임시로 채널이 없으면 더미를 생성하게 함
  @ApiOperation({
    summary: '모든 채널 조회'
  })
  @ApiOkResponse({
    description: '성공',
    type: [Channel]
  })
  @Get()
  async getAllChannels(): Promise<Channel[]> {
    const channels = await this.channelService.getAllChannels();

    if (channels.length === 0) {
      for (let idx = 0; idx < 10; idx++) {
        await this.channelService.createDummy();
      }
      return (await this.channelService.getAllChannels());
    }
    return (channels);
  }

  @ApiOperation({
    summary: '채널 생성'
  })
  @ApiOkResponse({
    description: '성공',
    type: Channel
  })
  @Post()
  createChannel(@Body() createChannelDto: CreateChannelDto): Promise<Channel> {
    return (this.channelService.createChannel(createChannelDto));
  }

  @ApiOperation({
    summary: '채널 id 검색'
  })
  @ApiOkResponse({
    description: '성공',
    type: Channel
  })
  @Get(':id')
  getChannelById(@Param('id') channelID: string): Promise<Channel> {
    return this.channelService.getChannelById(channelID);
  }

  @ApiOperation({
    summary: '채널 id 삭제'
  })
  @ApiOkResponse({
    description: '성공',
  })
  @Delete(':id')
  async deleteChannelById(@Param('id') channelID: string): Promise<void> {
    await this.channelService.deleteChannelById(channelID);
  }

}
