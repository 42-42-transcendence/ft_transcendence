import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';

@Entity()
export class Chat {
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  channelId: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.channelMembers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.channelMembers)
  @JoinColumn({ name: 'channelId' })
  channel: Channel;
}
