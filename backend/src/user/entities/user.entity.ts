import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAchievement } from '../../user-achievement/entities/user-achievement.entity';
import { ChannelMember } from '../../channel-member/entities/channel-member.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { Relation } from '../../relation/entities/relation.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Game } from 'src/game/entities/game.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userID: number;

  @Column({
    nullable: false,
    unique: true,
  })
  nickname: string;

  // @Column({ nullable: false })
  // isSecondAuth: boolean;

  // @Column({
  //   nullable: false,
  //   default: '/Users/jwee/ft_transcendence/backend/defaultImage.jpeg',
  // })
  // avatar: string;

  // @Column({ nullable: false })
  // point: number;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth

  // @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.achievement)
  // userAchievements: UserAchievement[];

  // @OneToMany(() => ChannelMember, (channelMember) => channelMember.user)
  // channelMembers: ChannelMember[];

  // @OneToMany(() => Chat, (chat) => chat.channel)
  // chats: Chat[];

  // @OneToMany(() => Relation, (relation) => relation.requester)
  // initiatedRelations: Relation[];

  // @OneToMany(() => Relation, (relation) => relation.responder)
  // receivedRelations: Relation[];

  // @OneToMany(() => Game, (game) => game.playerOne)
  // initiatedGames: Game[];
  
  // @OneToMany(() => Game, (game) => game.playerTwo)
  // joinedGames: Game[];
}
