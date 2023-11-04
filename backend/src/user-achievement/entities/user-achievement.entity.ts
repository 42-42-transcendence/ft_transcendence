import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Achievement } from '../../achievement/entities/achievement.entity';

@Entity()
export class UserAchievement {
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  achievementId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userAchievements)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Achievement, (achievement) => achievement.userAchievements, { cascade: true })
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;
}
