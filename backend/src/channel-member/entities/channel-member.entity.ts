import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';
import { ChannelMemberRole } from '../enums/channelMemberRole.enum';

@Entity()
export class ChannelMember {

  @PrimaryGeneratedColumn('uuid')
  channelMemberID: string

  @ManyToOne(() => Channel, (channel) => channel.channelMembers, { eager: true })
  @JoinColumn({ referencedColumnName: 'channelID' })
  channelFK: Channel;

  @ManyToOne(() => User, (user) => user.channelMembers, { eager: true })
  @JoinColumn({ referencedColumnName: 'userID' })
  userFK: User;

  @Column({
    type: 'enum',
    enum: ChannelMemberRole,
    default: ChannelMemberRole.GUEST,
  })
  role: string;

}
