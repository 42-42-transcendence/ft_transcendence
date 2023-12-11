import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GameTypeEnum } from '../enums/gameType.enum';
import { GameModeEnum } from '../enums/gameMode.enum';
import { ApiProperty} from '@nestjs/swagger';
//import { User } from '../user/user.entity.ts';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  gameID: string;

  @ApiProperty({
    description: '게임 이름',
    example: "User1's game",
    required: true,
  })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({
    description: '게임 날짜',
    example: '2023-05-15',
    required: true,
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ApiProperty({
    description: '유저1 아이디',
    example: 101,
    required: true,
  })
  @Column({ nullable: false })
  player1: string;

  @ApiProperty({
    description: '유저2 아이디',
    example: 102,
    required: true,
  })
  @Column({ nullable: true, default: null })
  player2 : string;

  @ApiProperty({
    description: 'winner 아이디',
    example: 101,
    required: true,
  })
  @Column({nullable : true, default: null })
  winner : string;

  @ApiProperty({
    description: '유저1 점수',
    example: 5,
    required: true,
  })
  @Column({ default: 0 })
  player1Score: number;

  @ApiProperty({
    description: '유저2 점수',
    example: 5,
    required: true,
  })
  @Column({ default: 0 })
  player2Score: number;

  @ApiProperty({
    description: '게임 타입 (래더 / 친선)',
    example: 'Ladder',
    required: true,
  })
  @Column({ type: 'enum', enum: [GameTypeEnum.LADDER, GameTypeEnum.PRIVATE] })
  gameType: GameTypeEnum;

  @ApiProperty({
    description: '게임 모드',
    example: 'Normal',
    required: true,
  })
  @Column({ type: 'enum', enum: [GameModeEnum.NORMAL, GameModeEnum.OBJECT, GameModeEnum.FAST] })
  gameMode: GameModeEnum;

  @ApiProperty({
    description: '게임 종료 상태',
    example: 'True',
    required: true,
  })
  @Column({default: false})
  finished : boolean
}
