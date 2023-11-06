import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelMember } from '../../channel-member/entities/channel-member.entity';
import { ChannelTypeEnum } from '../enums/channelType.enum';
import { Chat } from '../../chat/entities/chat.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@Entity()
export class Channel {

  @ApiProperty({
    description: '채널 Id',
    example: '1',
    required: true
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '채널 이름',
    example: 'Channel Title',
    required: true
  })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({
    description: '채널 인원수',
    example: '10',
    required: true,
    default: 0
  })
  @Column({
    type: 'int',
    default: 0,
  })
  total: number;

  @ApiProperty({
    description: '채널 비밀번호',
    example: 'qwer1234',
    required: true,
    default: ''
  })
  @Column({ nullable: false })
  password: string;

  @ApiProperty({
    description: '채널 타입',
    example: 'public',
    required: true,
    default: ChannelTypeEnum.PUBLIC
  })
  @Column({
    type: 'enum',
    enum: ChannelTypeEnum,
    default: ChannelTypeEnum.PUBLIC,
  })
  type: string;


  @OneToMany(() => ChannelMember, (channelMember) => channelMember.channel)
  channelMembers: ChannelMember[];

  @OneToMany(() => Chat, (chat) => chat.channel)
  chats: Chat[];
}
