import {vec2} from "gl-matrix";
import {Paddle, PaddlePos} from "./Paddle";
import data from "../interface/gameData";
import {GameObject, BallCorner} from "./GameObject";

export class Ball extends GameObject{
    public predictCollision(delta: number, paddlePos: PaddlePos | null) {
        const cornerPaddleArray = [
            { corner: BallCorner.TopRight, paddlePos: [PaddlePos.RightFront, PaddlePos.RightDown] },
            { corner: BallCorner.BottomRight, paddlePos: [PaddlePos.RightFront, PaddlePos.RightUp] },
            { corner: BallCorner.BottomLeft, paddlePos: [PaddlePos.LeftFront, PaddlePos.LeftUp] },
            { corner: BallCorner.TopLeft, paddlePos: [PaddlePos.LeftFront, PaddlePos.LeftDown] }
        ];

        for (const { corner, paddlePos } of cornerPaddleArray) {
            const ballPos = this.makeBallPosition(corner);

            for (const pos of paddlePos) {
                const factor = data.ball.calculateFactor(paddlePos);
                const ballDirection = vec2.scale(vec2.create(), this.direction, this.velocity * factor);
                const { c, d, r } = this.makePaddlePosition(pos);
                const { p, q } = this.calculateCollision(ballPos, ballDirection, c, d);

                if (!this.checkCollision(p, q, r, delta) && p > 0) {
                    return {p, pos}; // 충돌 감지 시 바로 p 반환
                }
            }
        }
        return undefined; // 충돌이 없는 경우
    }
    public handleWithWallCollision() {
        if (this.checkWithWallCollision()) {
            this.direction[1] *= -1;
        }
    }
    public handleWithPaddleCollision() : boolean {
        const paddle = data.paddle;

        for (let i = 0; i < 2; i++) {
            if (this.checkWithPaddleCollision(paddle[i])) {
                let normalReflect = vec2.fromValues(i === 0 ? 1 : -1, 0); // 왼쪽 패들이면 1, 오른쪽 패들이면 -1
                normalReflect[1] = (this.position[1] - paddle[i].position[1]) / paddle[i].height * 4.0;
                vec2.normalize(this.direction, normalReflect);
                return true;
            }
        }
        return false;
    }
}