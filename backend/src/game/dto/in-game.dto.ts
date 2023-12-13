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
    delta: number,
}

export interface GameInfoDto {
    readonly player1 : string,
    readonly player2 : string,
    readonly gameId : string,
    readonly player1score: number,
    readonly player2score : number
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

export interface InGameDto { 
    readonly displayName : string,
    readonly gameId : string,
    readonly player1 : string,
    readonly player2 : string
}

export interface sendGameDataDto {
	paddlePos: vec2[];
	height: number[];
	ballPos: vec2;
    scores: number[];
}