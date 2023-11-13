import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAchievement } from '../../user-achievement/entities/user-achievement.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  icon: string;
  @Column()
  description: string;

  // @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.user)
  // userAchievements: UserAchievement[];
}
