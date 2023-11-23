import {Paddle, Ball} from './in-game.dto'
//DB
export class Players {
    player1: string
    player1Score: number
    player2: string
    player2Score: number
}
//
export class GameObjectsDto {
    leftPaddle: Paddle;
    rightPaddle: Paddle;
    ball: Ball;
    players: Players;
}
