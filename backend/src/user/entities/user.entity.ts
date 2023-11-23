import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAchievement } from '../../user-achievement/entities/user-achievement.entity';
import { ChannelMember } from '../../channel-member/entities/channel-member.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Relation } from '../../relation/entities/relation.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Game } from 'src/game/entities/game.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../enums/user-status.enum';

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
    example: 'vdoohkimv',
    type: 'string',
    uniqueItems: true,
  })
  @Column({
    nullable: false,
    unique: true,
  })
  nickname: string;

  @Column({
    nullable: false,
    default: UserStatus.ONLINE,
  })
  status: UserStatus;

  @ApiProperty({
    description: '도전과제',
    example: '(byeonkim, first_victory), ...',
  })
  @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.achievement)
  userAchievements: UserAchievement[];

  @ApiProperty({
    description: 'Auth 두 번 이상 연결했는지',
    example: '0, 1',
    required: true,
  })
  @Column({
    nullable: false,
    default: false,
  })
  isSecondAuth: boolean;
  //아직 처리 안함

  @ApiProperty({
    description: '프로필 이미지',
    example: './User/byeonkim/images/kobe.jpg',
    required: true,
  })
  @Column({
    nullable: true,
    default: '../../../assets/images/default_profile_image.png',
  })
  avatar: string;

  @ApiProperty({
    description: '랭크 점수',
    example: '1000',
    required: true,
  })
  @Column({
    nullable: false,
    default: 1000,
  })
  point: number;

  @ApiProperty({
    description: '패배 횟수',
    example: '0',
    required: true,
  })
  @Column({
    nullable: false,
    default: 0,
  })
  lose: number;

  @ApiProperty({
    description: '승리 횟수',
    example: '0',
    required: true,
  })
  @Column({
    nullable: false,
    default: 0,
  })
  win: number;

  // @Column({ nullable: false })
  // isSecondAuth: boolean;

  // @Column({
  //   nullable: false,
  //   default: '/Users/jwee/ft_transcendence/backend/defaultImage.jpeg',
  // })
  // avatar: string;

  // @Column({ nullable: false })
  // point: number;

  @OneToOne(() => Auth, (auth) => auth.user, {
    onDelete: 'CASCADE',
  })
  auth: Promise<Auth>;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.user)
  channelMembers: Promise<ChannelMember[]>;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Promise<Chat[]>;

  @OneToMany(() => Relation, (relation) => relation.subjectUser)
  subjectRelations: Promise<Relation[]>;

  @OneToMany(() => Relation, (relation) => relation.objectUser)
  objectRelations: Promise<Relation[]>;

  // @OneToMany(() => Game, (game) => game.playerOne)
  // initiatedGames: Game[];

  // @OneToMany(() => Game, (game) => game.playerTwo)
  // joinedGames: Game[];
}
