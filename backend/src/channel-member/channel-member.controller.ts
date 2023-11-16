import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelMemberService } from './channel-member.service';

@Controller('channel-member')
export class ChannelMemberController {
  constructor(private readonly channelMemberService: ChannelMemberService) {}
}
