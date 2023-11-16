import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';

@ApiTags('USER')
@Controller('api/user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: '유저의 현재 접속한 전체 채널 조회'
  })
  @ApiOkResponse({
    description: '성공',
    type: [ChannelMember]
  })
  @Get(':id/channels')
  async getJoinChannels(@Param('id') userID: string): Promise<ChannelMember[]> {
    return (this.userService.getJoinChannels(userID));
  }
}
