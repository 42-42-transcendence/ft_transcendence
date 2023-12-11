import { GameTypeEnum } from "../enums/gameType.enum";
import {vec2} from "gl-matrix";
import { GameModeEnum } from "../enums/gameMode.enum";
import { User } from '../../user/entities/user.entity';
import { UserService } from "../../user/user.service";
import { Paddle } from "./Paddle";
import { Ball } from "./Ball";
import { GameData } from "../enums/gameData";

export class Players {
    player1: string //User.nickname
    player1Score: number
    player2: string //User.nickname
    player2Score: number
}

export let gamedata: GameData = {
	paddle: [new Paddle(-0.96, 0), new Paddle(0.96, 0)],
	ball : null,
	scores: [0, 0],
	lastTime: 0,
	mode: 'normal',
    players: {player1: "", player1Score: 0, player2: "", player2Score: 0},
};

export interface GameInfoDto {
    readonly player1 : string;
    readonly player2 : string;
    readonly gameId : string;
    readonly player1score: number;
    readonly player2score : number;
}

export interface GameOptionDto {
    player1 : string,
    player1score: number,
    player2 : string,
    player2score: number,
    gametype: GameTypeEnum,
    gamemode: GameModeEnum,
    isActive : boolean;
}

export interface InGameDto { 
    readonly displayName : string;
    readonly gameId : string;
    readonly player1 : string;
    readonly player2 : string;
}

export let sendGameData = {
	paddlePos: [vec2.fromValues(0, 0), vec2.fromValues(0, 0)],
	height: [0, 0],
	ballPos: vec2.fromValues(0, 0),
}