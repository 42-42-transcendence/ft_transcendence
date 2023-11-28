import data from "../interface/gameData";
import {vec2} from "gl-matrix";

export enum CanvasPosition {
    TopRight,
    BottomLeft,
    BottomRight,
    TopLeft,
}

export class GameManager {
    /* the playerSide 0 = leftPlayer and 1 is the other player */
    static scoreUpdate(playerSide: number) {
        if (playerSide === 0 || playerSide === 1) {
            ++data.scores[playerSide];
            data.scoreRef[playerSide]!.innerText = String(data.scores[playerSide]);
            this.resetBallPosition();
        }
    }

    static resetBallPosition() {
        const ball = data.ball;
        for (let i = 0; i < 2; i++)
            ball.position[i] = 0;
        ball.direction = vec2.fromValues(1.0, 0);
        ball.factor = 1.0;
    }

    static resetGame() {
        const ball = data.ball;
        for (let i = 0; i < 2; i++) {
            ball.position[i] = 0;
            data.scores[i] = 0;
            data.scoreRef[i]!.innerText = String(data.scores[i]);
        }
        ball.direction = vec2.fromValues(1.0, 0);
    }
    static isMatchConcluded() {
        return data.scores[0] === 5 || data.scores[1] === 5
    }
}
