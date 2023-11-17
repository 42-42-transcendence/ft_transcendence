import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from '../../channel/entities/channel.entity';
import { ChannelMemberRole } from '../enums/channel-member-role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ChannelMember {

  @ApiProperty({
    description: 'ChannelMember ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string'
  })
  @PrimaryGeneratedColumn('uuid')
  channelMemberID: string

  @ApiProperty({
    description: 'Channel 외래키',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string'
  })
  @ManyToOne(() => Channel, (channel) => channel.channelMembers, {
    onDelete: 'CASCADE'
  })
  // @JoinColumn({ referencedColumnName: 'channelID' })
  channel: Channel;

  @ApiProperty({
    description: 'User 외래키',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string'
  })
  @ManyToOne(() => User, (user) => user.channelMembers, {
    onDelete: 'CASCADE'
  })
  // @JoinColumn({ referencedColumnName: 'userID' })
  user: User;

  @ApiProperty({
    description: 'User의 채널 권한',
    example: 'GUEST',
    type: 'enum'
  })
  @Column({
    type: 'enum',
    enum: ChannelMemberRole,
    default: ChannelMemberRole.GUEST,
  })
  role: ChannelMemberRole;

}
