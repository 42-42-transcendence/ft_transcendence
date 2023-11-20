import {vec2} from "gl-matrix";
import data from "../interface/gameData";
import {GameManager} from "./GameManager";
import {Ball} from "./Ball";
import paddle, {Paddle} from "./Paddle";

class PhysicsEngine {
    static checkBallPaddleCollision(ballPos: vec2, paddle: Paddle) {
        const radius = data.ball.radius;

        const paddleHeightHalf = paddle.height / 2.0;
        const paddleWidthHalf = paddle.width / 2.0;
        let paddleTop = paddle.position[1] + paddleHeightHalf;
        let paddleBottom = paddle.position[1] - paddleHeightHalf;
        let paddleLeft = paddle.position[0] - paddleWidthHalf;
        let paddleRight = paddle.position[0] + paddleWidthHalf;

        const BallTop = ballPos[1] + radius;
        const BallBottom = ballPos[1] - radius;
        const BallLeft = ballPos[0] - radius;
        const BallRight = ballPos[0] + radius;

        return (BallTop > paddleBottom && BallBottom < paddleTop && BallLeft < paddleRight && BallRight > paddleLeft);
    }
    static handleBallPaddleCollision() {
        const ball = data.ball;
        const paddle = data.paddle;

        for (let i = 0; i < 2; i++) {
            if (this.checkBallPaddleCollision(ball.position, paddle[i])) {
                let normalReflect = vec2.fromValues(i == 0 ? 1 : -1, 0); // 왼쪽 패들이면 1, 오른쪽 패들이면 -1
                normalReflect[1] = (ball.position[1] - paddle[i].position[1]) / paddle[i].height * 3.0;
                // if (i === 0 && BallLeft < paddle[i].position[0] || i === 1 && BallRight > paddle[i].position[0])
                //     normalReflect[0] *= -1;
                vec2.normalize(ball.direction, normalReflect);
            }
        }
    }

    static handleBallWallCollision() {
        const ball = data.ball;
        if (ball.position[1] + ball.radius > 1.0 || ball.position[1] - ball.radius < -1.0) {
            ball.direction[1] *= -1; // 위, 아래 벽에 닿을 경우 공의 반사를 구현 (정반사)
        }
    }

    static collisionGuarantee(ball: Ball, delta: number) {
        for (let i = 0; i < 2; i++) {
            const dir = i === 0 ? 1 : -1;
            const x1 = ball.position[0];
            const y1 = ball.position[1];
            const x2 = data.paddle[i].position[0];
            const y2 = data.paddle[i].position[1];
            const wh = data.paddle[i].width / 2.0;
            const hh = data.paddle[i].height / 2.0;
            const dx = ball.direction[0] * ball.velocity;
            const dy= ball.direction[1] * ball.velocity;

            const t = (x2 - x1 + (wh * dir) - hh) / dx;
            const k = y2 - y1 - dy * t;

            /* 충돌이 없다면 */
            if ((k < 0 || k > hh * 2) && t > delta) {
                this.updateBallPosition(delta);
                return;
            }
            /* 충돌이 있다면 */
            this.updateBallPosition(t);
            const restAfterCollision = delta - t;
            this.handleBallPaddleCollision();
            this.updateBallPosition(restAfterCollision);
        }
    }
    static calculateBallPosition(ball: Ball, delta: number) : vec2 {
        let tempVec2 = vec2.create();
        vec2.add(tempVec2, ball.position, vec2.scale(tempVec2, ball.direction, ball.velocity * delta));
        return tempVec2;
    }

    static updateBallPosition(delta: number) {
        data.ball.position = this.calculateBallPosition(data.ball, delta);
    }

    static updatePaddlePosition(delta: number) {
        const paddle = data.paddle;
        /* 현재 player1의 패들 위치만 고려 */
        if (data.keyPress.up) {
            paddle[0].position[1] += paddle[0].paddleSpeed * delta
        } else if (data.keyPress.down) {
            paddle[0].position[1] -= paddle[0].paddleSpeed * delta;
        } else {
            paddle[0].position[1] += 0;
        }

        /* 패들 위치 제한 */
        if (paddle[0].position[1] - paddle[0].height / 2.0 < -1.0) {
            paddle[0].position[1] = -1.0 + paddle[0].height / 2.0;
        }
        if (paddle[0].position[1] + paddle[0].height / 2.0 > 1.0)
            paddle[0].position[1] = 1.0 - paddle[0].height / 2.0;
    }
}
export default PhysicsEngine;