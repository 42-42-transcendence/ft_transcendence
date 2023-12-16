import {vec2} from "gl-matrix";
import { GameDataDto } from "./in-game.dto";

export class GameManager {
    /* the playerSide 0 = leftPlayer and 1 is the other player */
    static scoreUpdate(playerSide: number | null, gamedata: GameDataDto) {
        if (playerSide === 0 || playerSide === 1) {
            ++gamedata.scores[playerSide];
            this.resetBallPosition(gamedata);
        }
    }

    static resetBallPosition(gamedata: GameDataDto) {
        const ball = gamedata.ball;
        for (let i = 0; i < 2; i++)
            ball.position[i] = 0;
        ball.direction = vec2.fromValues(1.0, 0);
        ball.factor = 1.0;
    }
}