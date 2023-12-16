import { GameTypeEnum } from "../enums/gameType.enum";
import { GameModeEnum } from "../enums/gameMode.enum";
import { Paddle } from "./Paddle";
import { Ball } from "./Ball";
import { Item } from "./Item";

export interface GameDataDto {
	paddle: Paddle[],
	ball: Ball,
	scores: number[],
    items: Item[],
	lastTime: number,
	mode: string,
}

export interface GameOptionDto {
    player1 : string,
    player2 : string,
    gametype: GameTypeEnum,
    gamemode: GameModeEnum,
    isActive : boolean
}

export interface sendGameDataDto {
	paddlePos: [[number, number], [number, number]];
	height: number[];
	ballPos: [number, number];
    itemsPos: [number, number][];
    scores: number[];
}