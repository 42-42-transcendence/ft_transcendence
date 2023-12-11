import data from "../interface/gameData";
import {vec2} from "gl-matrix";
import {ItemManager} from "./ItemManager";

export enum CanvasPosition {
    Top,
    Bottom,
    Right,
    Left,
}

export class GameManager {
    /* the playerSide 0 = leftPlayer and 1 is the other player */
    static scoreUpdate(playerSide: number | null) {
        if (playerSide === 0 || playerSide === 1) {
            ++data.scores[playerSide];
            data.scoreRef[playerSide]!.innerText = String(data.scores[playerSide]);
            this.resetBallPosition();
        } else {
            data.scoreRef[0]!.innerText = String(data.scores[0]);
            data.scoreRef[1]!.innerText = String(data.scores[1]);
        }
    }

    static cleanupWebGL() {
        const gl = data.gl as WebGLRenderingContext;

        if (data.paddleBuffer) {
            gl.deleteBuffer(data.paddleBuffer);
            data.paddleBuffer = null;
        }
        if (data.ballBuffer) {
            gl.deleteBuffer(data.ballBuffer);
            data.ballBuffer = null;
        }
        if (data.lineBuffer) {
            gl.deleteBuffer(data.lineBuffer);
            data.lineBuffer = null;
        }

        if (data.program) {
            data.program.forEach(program => {
                if (program) {
                    gl.deleteProgram(program);
                    program = null;
                }
            });
        }

        ItemManager.getInstance().clearItems();
        // WebGL 컨텍스트 해제
        gl.getExtension('WEBGL_lose_context')?.loseContext();
    }

    static resetBallPosition() {
        const ball = data.ball;
        for (let i = 0; i < 2; i++)
            ball.position[i] = 0;
        ball.direction = vec2.fromValues(1.0, 0);
        ball.factor = 1.0;
    }

    static endGame() {
        const ball = data.ball;
        /* 테스트용 초기화 코드 */
        for (let i = 0; i < 2; i++) {
            ball.position[i] = 0;
            data.scores[i] = 0;
            data.scoreRef[i]!.innerText = String(data.scores[i]);
        }
        ball.direction = vec2.fromValues(1.0, 0);

        /* 게임 종료 */
        // console.log('게임 종료');
        // window.dispatchEvent(new CustomEvent('gameEnd', {}));
    }
    static isMatchConcluded() {
        return data.scores[0] === 5 || data.scores[1] === 5;
    }
}
