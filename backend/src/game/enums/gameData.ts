import { Ball } from "../dto/Ball";
import { Players } from "../dto/in-game.dto";
import { Paddle } from "../dto/Paddle";

export interface GameData {
	paddle: Paddle[];
	ball: Ball;
	scores: number[];
	lastTime: number;
	mode: string;
    players: Players;
	// endgame: boolean;
}