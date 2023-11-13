import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';
import { ChannelMemberRole } from '../enums/channelMemberRole.enum';

@Entity()
export class ChannelMember {
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  channelId: number;

  @Column({
    type: 'enum',
    enum: ChannelMemberRole,
    default: ChannelMemberRole.GUEST,
  })
  role: string;

  // @ManyToOne(() => User, (user) => user.channelMembers)
  // @JoinColumn({ name: 'userId' })
  // user: User;

  // @ManyToOne(() => Channel, (channel) => channel.channelMembers)
  // @JoinColumn({ name: 'channelId' })
  // channel: Channel;
}
