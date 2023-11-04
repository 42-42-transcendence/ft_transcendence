import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelMember } from '../../channel-member/entities/channel-member.entity';
import { ChannelTypeEnum } from '../enums/channelType.enum';
import { Chat } from '../../chat/entities/chat.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  title: string;
  @Column({
    type: 'int',
    default: 0,
  })
  total: number;
  @Column({ nullable: false })
  password: string;
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
