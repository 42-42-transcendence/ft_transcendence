import { GameTypeEnum } from "../enums/gameType.enum";
import { GameModeEnum } from "../enums/gameMode.enum";
import { Paddle } from "../classes/Paddle";
import { Ball } from "../classes/Ball";
import { Item } from "../classes/Item";

export interface GameDataDto {
	paddle: Paddle[],
	ball: Ball,
	scores: number[],
    items: Item[],
	lastTime: number,
	mode: string,
    intervalId: NodeJS.Timeout,
}

export interface GameOptionDto {
    player1 : string,
    player2 : string,
    gametype: GameTypeEnum,
    gamemode: GameModeEnum,
    isActive : boolean
}

export interface sendGameDataDto {
	paddlePos: [number[], number[]];
	height: number[];
	ballPos: number[];
    itemsPos: number[][];
    scores: number[];
}