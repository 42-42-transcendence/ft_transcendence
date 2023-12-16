import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserAchievement } from '../../user-achievement/entities/user-achievement.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Achievement {
  @PrimaryColumn()
  id: number;

  @ApiProperty({
    description: '도전과제 이름',
    example: 'First Victory!',
    type: 'string',
    uniqueItems: true,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '도전과제 설명',
    example: 'First Blood!',
    uniqueItems: true,
  })
  @Column()
  description: string;

  @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.user)
  userAchievements: UserAchievement[];
}
