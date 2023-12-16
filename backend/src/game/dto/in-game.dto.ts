import { GameTypeEnum } from "../enums/gameType.enum";
import { vec2 } from "gl-matrix";
import { GameModeEnum } from "../enums/gameMode.enum";
import { Paddle } from "./Paddle";
import { Ball } from "./Ball";

export interface GameDataDto {
	paddle: Paddle[],
	ball: Ball,
	scores: number[],
	lastTime: number,
	mode: string,
}

export interface GameOptionDto {
    player1 : string,
    player1score: number,
    player2 : string,
    player2score: number,
    gametype: GameTypeEnum,
    gamemode: GameModeEnum,
    isActive : boolean
}

export interface sendGameDataDto {
	paddlePos: [[number, number], [number, number]];
	height: number[];
	ballPos: [number, number];
    // itemsPos: vec2[];
    scores: number[];
}