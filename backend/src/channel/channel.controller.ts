import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Channel } from './entities/channel.entity';

@ApiTags('CHANNEL')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @ApiOperation({
    summary: '모든 채널 조회'
  })
  @ApiOkResponse({
    description: '성공',
    type: [Channel]
  })
  @Get()
  getAllChannels(): Promise<Channel[]> {
    return (this.channelService.getAllChannels());
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
  getChannelById(@Param('id') id: number): Promise<Channel> {
    return this.channelService.getChannelById(id);
  }

  @ApiOperation({
    summary: '채널 id 삭제'
  })
  @ApiOkResponse({
    description: '성공',
  })
  @Delete(':id')
  async deleteChannelById(@Param('id') id: number): Promise<void> {
    await this.channelService.deleteChannelById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }


}
