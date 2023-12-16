import { ApiProperty } from "@nestjs/swagger";
import { ChannelTypeEnum } from "../enums/channelType.enum";
import { IsEnum, Length } from "class-validator";

export class ChannelDto {

	@ApiProperty({
		description: '채널 이름',
		example: 'Channel Title',
		required: true
	})
	@Length(1, 30, {
		message: "채널 타이틀의 길이는 1 ~ 30까지 입니다."
	})
	title: string;

	@ApiProperty({
		description: '채널 비밀번호',
		example: 'qwer1234',
		required: true,
		default: ''
	})
	@Length(0, 16, {
		message: `채널 비밀번호의 길이는 0 ~ 16까지 입니다.`
	})
	password: string;

	@ApiProperty({
		description: '채널 타입',
		example: 'public',
		required: true,
		default: ChannelTypeEnum.PUBLIC
	})
	@IsEnum(ChannelTypeEnum, {
		message: `채널 타입은 다음과 같이 지정해야 합니다: public, private, dm`
	})
	type: ChannelTypeEnum;
}
