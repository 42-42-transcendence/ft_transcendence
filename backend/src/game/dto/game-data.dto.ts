export class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    delta: number;
    speed: number;
}

export class  Ball {
    x: number;
    y: number;
    width: number;
    height: number;
    delta: number;
    speed: number;
}

//DB
export class Players {
    player1: string
    player1Score: number
    player2: string
    player2Score: number
}

export class GameDataDto {
    leftPaddle: Paddle;
    rightPaddle: Paddle;
    ball: Ball;
    players: Players;
}