import { ApiProperty } from "@nestjs/swagger";
import { ChannelTypeEnum } from "../enums/channelType.enum";

export class ChannelDto {

	@ApiProperty({
		description: '채널 이름',
		example: 'Channel Title',
		required: true
	})
	title: string;

	@ApiProperty({
		description: '채널 비밀번호',
		example: 'qwer1234',
		required: true,
		default: ''
	})
	password: string;

	@ApiProperty({
		description: '채널 타입',
		example: 'public',
		required: true,
		default: ChannelTypeEnum.PUBLIC
	})
	type: ChannelTypeEnum;
}
