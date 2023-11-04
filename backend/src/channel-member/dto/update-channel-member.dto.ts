import { PartialType } from '@nestjs/swagger';
import { CreateChannelMemberDto } from './create-channel-member.dto';

export class UpdateChannelMemberDto extends PartialType(CreateChannelMemberDto) {}
