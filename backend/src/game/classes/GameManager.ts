import {vec2} from "gl-matrix";
import { GameDataDto } from "../dto/in-game.dto";

export class GameManager {
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

        let rand = Math.random() * 2;
        if (rand < 1)
            ball.direction = vec2.fromValues(1.0, 0);
        else
            ball.direction = vec2.fromValues(-1.0, 0);        
        ball.factor = 1.0;
        ball.velocity = 1.0;
    }
}
