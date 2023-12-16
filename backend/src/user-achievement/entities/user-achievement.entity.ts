import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Achievement } from '../../achievement/entities/achievement.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UserAchievement {
  // @ApiProperty({
  //   description: '도전과제 성취 날짜',
  //   example: '',
  //   required: true,
  // })
  // @CreateDateColumn()
  // createdAt: Date;
  // date: any;

  @ApiProperty({
    description: 'user-achieve ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
  })
  @PrimaryGeneratedColumn('uuid')
  userachievementID: string;

  @ManyToOne(() => User, (user) => user.userAchievements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nickname' })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.userAchievements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;

  @ApiProperty({
    description: '도전과제 성취여부',
  })
  @Column({ default: false })
  isAchieved: boolean;
}
