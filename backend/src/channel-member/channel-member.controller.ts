import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelMemberService } from './channel-member.service';
import { CreateChannelMemberDto } from './dto/create-channel-member.dto';
import { UpdateChannelMemberDto } from './dto/update-channel-member.dto';

@Controller('channel-member')
export class ChannelMemberController {
  constructor(private readonly channelMemberService: ChannelMemberService) {}

  @Post()
  create(@Body() createChannelMemberDto: CreateChannelMemberDto) {
    return this.channelMemberService.create(createChannelMemberDto);
  }

  @Get()
  findAll() {
    return this.channelMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelMemberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelMemberDto: UpdateChannelMemberDto) {
    return this.channelMemberService.update(+id, updateChannelMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelMemberService.remove(+id);
  }
}
