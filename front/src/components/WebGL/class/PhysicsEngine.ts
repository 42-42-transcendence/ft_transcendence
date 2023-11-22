import {vec2} from "gl-matrix";
import data from "../interface/gameData";
import {Ball, BallCorner} from "./Ball";
import {Paddle, PaddlePos} from "./Paddle";

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
    static handleBallPaddleCollision() : boolean {
        const ball = data.ball;
        const paddle = data.paddle;

        for (let i = 0; i < 2; i++) {
            if (this.checkBallPaddleCollision(ball.position, paddle[i])) {
                let normalReflect = vec2.fromValues(i === 0 ? 1 : -1, 0); // 왼쪽 패들이면 1, 오른쪽 패들이면 -1
                normalReflect[1] = (ball.position[1] - paddle[i].position[1]) / paddle[i].height * 4.0;
                vec2.normalize(ball.direction, normalReflect);
                return true;
            }
        }
        return false;
    }

    static handleBallWallCollision() {
        const ball = data.ball;
        if (ball.position[1] + ball.radius > 1.0 || ball.position[1] - ball.radius < -1.0) {
            ball.direction[1] *= -1; // 위, 아래 벽에 닿을 경우 공의 반사를 구현 (정반사)
        }
    }

    private static crossProduct = (a: vec2, b: vec2): number => a[0] * b[1] - a[1] * b[0];

    // private static calculateConflict(a: vec2, b: vec2, c : vec2, d :vec2) {
    //     const p = (this.crossProduct(vec2.sub(vec2.create(), c, a), d)) / this.crossProduct(b, d);
    //     const q = (a[1] + p * b[1] - c[1]) / d[1];
    //     return {p, q};
    // }
    //
    // private static checkConflict(p: number, q: number, l: number, delta: number) : boolean {
    //     return (q < 0 || q > l) || p > delta || p < 0;
    // }
    //
    // private static makeBallPosition(ball: Ball, ballCorner: BallCorner) : vec2 {
    //     switch (ballCorner) {
    //         case BallCorner.TopRight:
    //             return vec2.fromValues(ball.position[0] + ball.radius, ball.position[1] + ball.radius);
    //         case BallCorner.BottomRight:
    //             return vec2.fromValues(ball.position[0] + ball.radius, ball.position[1] - ball.radius);
    //         case BallCorner.TopLeft:
    //             return vec2.fromValues(ball.position[0] - ball.radius, ball.position[1] + ball.radius);
    //         case BallCorner.BottomLeft:
    //             return vec2.fromValues(ball.position[0] - ball.radius, ball.position[1] - ball.radius);
    //     }
    // }
    //
    // private static makePaddlePosition(paddle: Paddle, paddlePos: PaddlePos) : vec2 {
    //     switch (paddlePos) {
    //         case PaddlePos.LeftFront:
    //             return vec2.fromValues(paddle.position[0] + paddle.width / 2.0, paddle.position[1] - paddle.height / 2.0);
    //         case PaddlePos.LeftUp:
    //             return vec2.fromValues(paddle.position[0] - paddle.width / 2.0, paddle.position[1] + paddle.height / 2.0);
    //         case PaddlePos.LeftDown:
    //             return vec2.fromValues(paddle.position[0] - paddle.width / 2.0, paddle.position[1] - paddle.height / 2.0);
    //         case PaddlePos.RightFront:
    //             return vec2.fromValues(paddle.position[0] - paddle.width / 2.0, paddle.position[1] - paddle.height / 2.0);
    //         case PaddlePos.RightUp:
    //             return vec2.fromValues(paddle.position[0] + paddle.width / 2.0, paddle.position[1] + paddle.height / 2.0);
    //         case PaddlePos.RightDown:
    //             return vec2.fromValues(paddle.position[0] + paddle.width / 2.0, paddle.position[1] - paddle.height / 2.0);
    //     }
    // }
    // static calCheckConflict(ball: Ball, delta: number, paddle: Paddle) {
    //     for (let i = 0; i < 2; i++) {
    //         const dir = i === 0 ? 1 : -1;
    //         const d = vec2.fromValues(0, 1);
    //         const wh = paddle.width / 2.0;
    //         const hh = paddle.height / 2.0;
    //         const a = vec2.fromValues(ball.position[0] - ball.radius, ball.position[1]);
    //         const c = vec2.sub(vec2.create(), vec2.add(vec2.create(), paddle.position, vec2.fromValues(wh * dir, 0)), vec2.fromValues(0, hh));
    //         const b = vec2.scale(vec2.create(), ball.direction, ball.velocity);
    //
    //         const {p, q} = this.calculateConflict(a, b, c, d);
    //         if (this.checkConflict(p, q, hh * 2, delta)) {
    //             continue;
    //         }
    //         return {p, q};
    //     }
    // }

    static GuaranteeConflict(ball: Ball, delta: number) {
        let flag = false;
        let p = 0;

        for (let i = 0; i < 2; i++) {
            const dir = i === 0 ? 1 : -1;
            const d = vec2.fromValues(0, 1);
            const wh = data.paddle[i].width / 2.0;
            const hh = data.paddle[i].height / 2.0;
            const a = ball.position;
            const c = vec2.sub(vec2.create(), vec2.add(vec2.create(), data.paddle[i].position, vec2.fromValues(wh * dir, 0)), vec2.fromValues(0, hh));
            const b = vec2.scale(vec2.create(), ball.direction, ball.velocity);

            p = (this.crossProduct(vec2.sub(vec2.create(), c, a), d)) / this.crossProduct(b, d);
            const q = (a[1] + p * b[1] - c[1]) / d[1];
            if ((q < 0 || q > hh * 2) || p > delta || p < 0) {
                continue;
            }
            flag = true;
            break;
        }
        /* 충돌이 없다면 */
        if (!flag) {
            this.updateBallPosition(delta);
            return ;
        }
        this.updateBallPosition(p);
        this.handleBallPaddleCollision()
        const restAfterCollision = delta - p;
        this.updateBallPosition(restAfterCollision);
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