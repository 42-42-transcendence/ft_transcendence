import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelMember } from '../../channel-member/entities/channel-member.entity';
import { ChannelTypeEnum } from '../enums/channelType.enum';
import { Chat } from '../../chat/entities/chat.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Channel {

  @ApiProperty({
    description: 'Channel ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string'
  })
  @PrimaryGeneratedColumn('uuid')
  channelID: string;

  @ApiProperty({
    description: '채널 이름',
    example: 'Channel Title',
    type: 'string'
  })
  @Column({
    nullable: false
  })
  title: string;

  @ApiProperty({
    description: '채널 인원수',
    example: '10',
    type: 'number',
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
    type: 'string',
    default: ''
  })
  @Column({ nullable: false })
  password: string;

  @ApiProperty({
    description: '채널 타입',
    example: 'public',
    type: 'enum',
    default: ChannelTypeEnum.PUBLIC
  })
  @Column({
    type: 'enum',
    enum: ChannelTypeEnum,
    default: ChannelTypeEnum.PUBLIC,
  })
  type: ChannelTypeEnum;


  @OneToMany(() => ChannelMember, (channelMember) => channelMember.channel, {
    cascade: true
  })
  channelMembers: Promise<ChannelMember[]>;

  // cascade 옵션이 없어도 자식의 설정만 잘 되어있다면, 부모가 삭제될때 자식도 같이 삭제된다.
  @OneToMany(() => Chat, (chat) => chat.channel, {
    cascade: ['insert', 'update', 'remove']
  })
  chats: Promise<Chat[]>;
}
