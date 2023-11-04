import { Column, PrimaryGeneratedColumn } from 'typeorm';
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

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'playerOneId' })
  // playerOne: User;
  //
  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'playerTwoId' })
  // playerTwo: User;
}
