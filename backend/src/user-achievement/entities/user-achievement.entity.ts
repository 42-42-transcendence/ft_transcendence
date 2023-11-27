import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn,Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Achievement } from '../../achievement/entities/achievement.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserAchievement {
  @PrimaryColumn()
  usernickname: string;
  @PrimaryColumn()
  achievementId: number;

  @Column({
    nullable: false,
    default: false,
  })
  isAchieved: boolean;
  // @ApiProperty({
  //   description: '도전과제 성취 날짜',
  //   example: '',
  //   required: true,
  // })
  // @CreateDateColumn()
  // createdAt: Date;
  // date: any;

  @ManyToOne(() => User, (user) => user.userAchievements)
  @JoinColumn({ name: 'usernickname' })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.userAchievements, { cascade: true })
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;
  newUserAchievement: Achievement[];
}
