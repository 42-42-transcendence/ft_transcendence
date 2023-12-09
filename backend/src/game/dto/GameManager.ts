import {vec2} from "gl-matrix";
import { gamedata } from "./in-game.dto";

export class GameManager {
    /* the playerSide 0 = leftPlayer and 1 is the other player */
    static scoreUpdate(playerSide: number) {
        if (playerSide === 0 || playerSide === 1) {
            ++gamedata.scores[playerSide];
            // gamedata.scoreRef[playerSide]!.innerText = String(gamedata.scores[playerSide]); //
            this.resetBallPosition();
        }
    }

    static resetBallPosition() {
        const ball = gamedata.ball;
        for (let i = 0; i < 2; i++)
            ball.position[i] = 0;
        ball.direction = vec2.fromValues(1.0, 0);
        ball.factor = 1.0;
    }

    static endGame() {
        // const ball = data.ball;
        /* 테스트용 초기화 코드 */
        // for (let i = 0; i < 2; i++) {
        //     ball.position[i] = 0;
        //     data.scores[i] = 0;
        //     data.scoreRef[i]!.innerText = String(data.scores[i]);
        // }
        // ball.direction = vec2.fromValues(1.0, 0);

        /* 게임 종료 */
        console.log('게임 종료');
        window.dispatchEvent(new CustomEvent('gameEnd', {}));
    }
    static isMatchConcluded() {
        return gamedata.scores[0] === 5 || gamedata.scores[1] === 5;
    }
}
