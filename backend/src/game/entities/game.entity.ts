import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameTypeEnum } from '../enums/gameType.enum';
import { GameModeEnum } from '../enums/gameMode.enum';
import { User } from 'src/user/entities/user.entity';

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
  // @JoinColumn({ referencedColumnName: 'userID', name: 'playerOneId' })
  // playerOne: User;
  
  // @ManyToOne(() => User)
  // @JoinColumn({ referencedColumnName: 'userID', name: 'playerOneId' })
  // playerTwo: User;
}
