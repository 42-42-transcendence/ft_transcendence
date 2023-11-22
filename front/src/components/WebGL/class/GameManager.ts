import data from "../interface/gameData";
import {vec2} from "gl-matrix";

export class GameManager {
    static scoreUpdate(player: string) {
        const idx = player === 'player1' ? 0 : 1;
        ++data.scores[idx];
        data.scoreRef[idx]!.innerText = String(data.scores[idx]);
        this.resetBallPosition();
    }

    static checkOverLine(ballPos: vec2) : string {
        const radius = data.ball.radius;

        if (ballPos[0] + radius > 1.0 || ballPos[0] - radius < -1.0) {
            console.log("점수 획득"); // 디버깅
            return ballPos[0] + radius > 1.0 ? 'player1' : 'player2';
        }
        return '';
    }

    static resetBallPosition() {
        const ball = data.ball;
        for (let i = 0; i < 2; i++)
            ball.position[i] = 0;
        ball.direction = vec2.fromValues(1.0, 0);
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
