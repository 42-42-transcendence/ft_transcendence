import { GameTypeEnum } from "../enums/gameType.enum";
import { GameModeEnum } from "../enums/gameMode.enum";

import { vec2 } from "gl-matrix";

export class Paddle {
    position: vec2;
    paddleSpeed: number;
    width: number;
    height: number;
    delta: number;
    paddleVertices = new Float32Array();

    constructor(x: number, y: number, width: number = 0.05, height: number = 0.5) {
        this.position = vec2.fromValues(x, y);
        this.paddleSpeed = 2.0;
        this.width = width;
        this.height = height;
        this.calculateVertices();
    }

    public calculateVertices() {
        // 버텍스 계산 로직
        this.paddleVertices = new Float32Array([
            this.position[0] - this.width / 2.0, this.position[1] - this.height / 2.0, // 1
            this.position[0] + this.width / 2.0, this.position[1] - this.height / 2.0, // 2
            this.position[0] - this.width / 2.0, this.position[1] + this.height / 2.0, // 3

            this.position[0] + this.width / 2.0, this.position[1] - this.height / 2.0, // 2
            this.position[0] - this.width / 2.0, this.position[1] + this.height / 2.0, // 3
            this.position[0] + this.width / 2.0, this.position[1] + this.height / 2.0, // 4
        ]);
    }
}

export class Ball {
    position: vec2;
    direction: vec2;
    velocity: number;
    radius: number;
    ballVertices = new Float32Array();
    constructor() {
        this.position = vec2.fromValues(0, 0);
        this.direction = vec2.fromValues(1.0, 0);
        this.velocity = 2.0;
        this.radius = 0.02; // 공의 반지름
        this.calculateVertices();
    }

    public calculateVertices() {
        this.ballVertices = new Float32Array([
            this.position[0] - this.radius, this.position[1] + this.radius,  // 1
            this.position[0] + this.radius, this.position[1] + this.radius,  // 2
            this.position[0] - this.radius, this.position[1] - this.radius,   // 3

            this.position[0] + this.radius, this.position[1] + this.radius,  // 2
            this.position[0] - this.radius, this.position[1] - this.radius,   // 3
            this.position[0] + this.radius, this.position[1] - this.radius,    // 4
        ]);
    }
}

export interface KeyPress {
	up: boolean;
	down: boolean;
};

export interface GameInfoDto {
    readonly player1 : string;
    readonly player2 : string;
    readonly gameId : string;
    // readonly player1score: number;
    // readonly player2Score : number;
}

export interface GameOptionDto {
    player1 : string;
    player2 : string;
    paddleHeight : number;
    ballSpeed : number;
    paddleSpeed : number;
    gametype: GameTypeEnum;
    gamemode: GameModeEnum;
    isInGame : boolean;
}

export interface JoinGameDto { // will combine with GameInfoDto
    readonly displayName : string;
    readonly gameId : string;
    readonly player1 : string;
    readonly player2 : string;
}

export class GameData {
	paddle: Paddle[] = [new Paddle(-0.96, 0), new Paddle(0.96, 0)];
	ball: Ball = new Ball();
	keyPress: KeyPress = {
		up: false,
		down: false,
	};
	scores: [number, number] = [0, 0];
	lastTime: number = 0;
	mode: GameModeEnum.NORMAL;
}
