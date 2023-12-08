import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAchievement } from '../../user-achievement/entities/user-achievement.entity';
import { ChannelMember } from '../../channel-member/entities/channel-member.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Relation } from '../../relation/entities/relation.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Game } from 'src/game/entities/game.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../enums/user-status.enum';
import { Notification } from 'src/notification/entities/notification.entity';

@Entity()
export class User {

  @ApiProperty({
		description: 'User ID',
		example: '550e8400-e29b-41d4-a716-446655440000',
		type: 'string',
	})
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @ApiProperty({
		description: '닉네임',
		example: 'doohkim',
		type: 'string',
    uniqueItems: true
	})
  @Column({
    nullable: false,
    unique: true,
  })
  nickname: string;

  @Column({
    nullable: false,
    default: UserStatus.ONLINE
  })
  status: UserStatus;

  @Column({ nullable: true })
  otpAuthSecret: string;

  @Column({
    default: false,
  })
  isActiveOtp: boolean;

  // @Column({
  //   nullable: false,
  //   default: '/Users/jwee/ft_transcendence/backend/defaultImage.jpeg',
  // })
  // avatar: string;

  // @Column({ nullable: false })
  // point: number;

  @OneToOne(() => Auth, (auth) => auth.user, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  auth: Auth;

  // @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.achievement)
  // userAchievements: UserAchievement[];

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.user, {
    cascade: true
  })
  channelMembers: Promise<ChannelMember[]>;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Promise<Chat[]>;

  @OneToMany(() => Relation, (relation) => relation.subjectUser, {
    cascade: true
  })
  subjectRelations: Promise<Relation[]>;

  @OneToMany(() => Relation, (relation) => relation.objectUser, {
    cascade: true
  })
  objectRelations: Promise<Relation[]>;

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true
  })
  notifications: Promise<Notification[]>

  // @OneToMany(() => Game, (game) => game.playerOne)
  // initiatedGames: Game[];

  // @OneToMany(() => Game, (game) => game.playerTwo)
  // joinedGames: Game[];
}
