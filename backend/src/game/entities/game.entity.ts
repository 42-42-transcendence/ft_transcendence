import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { GameTypeEnum } from '../enums/gameType.enum';
import { GameModeEnum } from '../enums/gameMode.enum';

export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: GameTypeEnum,
    default: GameTypeEnum.LADDER,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'enum',
    enum: GameModeEnum,
    default: GameModeEnum.NORMAL,
    nullable: false,
  })
  mode: string;

  @Column()
  winnerId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'playerOneId' })
  playerOne: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'playerTwoId' })
  playerTwo: User;
}
