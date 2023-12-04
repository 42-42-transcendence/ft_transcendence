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
    static scoreUpdate(playerSide: number) {
        if (playerSide === 0 || playerSide === 1) {
            ++data.scores[playerSide];
            data.scoreRef[playerSide]!.innerText = String(data.scores[playerSide]);
            this.resetBallPosition();
        }
    }

    static cleanupWebGL() {
        const gl = data.gl;
        // WebGL 컨텍스트가 유효한지 확인
        if (!gl) {
            console.error("WebGL 컨텍스트가 유효하지 않습니다.");
            return;
        }

        // 버퍼 해제
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
        // 셰이더 프로그램 해제
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
