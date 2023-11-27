import {vec2} from "gl-matrix";
import data from "../interface/gameData";
import {Ball} from "./Ball";
import {Paddle, PaddlePos} from "./Paddle";
import {Item} from "./Item";

class PhysicsEngine {
    static _paddlePos : PaddlePos | null = null;
    static checkBallPaddleCollision(paddle: Paddle) {
        const ballPos = data.ball.position;
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
            if (this.checkBallPaddleCollision(paddle[i])) {
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

    // private static crossProduct = (a: vec2, b: vec2): number => a[0] * b[1] - a[1] * b[0];

    // private static calculateConflict(a: vec2, b: vec2, c : vec2, d :vec2) {
    //     const crossB_D = this.crossProduct(b, d);
    //     if (crossB_D === 0) {
    //         return { p: -1, q: -1 };
    //     }
    //     const p = (this.crossProduct(vec2.sub(vec2.create(), c, a), d)) / this.crossProduct(b, d);
    //     const q = (this.crossProduct(vec2.sub(vec2.create(), a, c), b)) / this.crossProduct(d, b);
    //     return {p, q};
    // }

    // private static checkConflict(p: number, q: number, l: number, delta: number) : boolean {
    //     return (q < 0 || q > l) || p > delta || p < 0;
    // }
    //
    // private static makeBallPosition(ballCorner: BallCorner) : vec2 {
    //     const ball = data.ball;
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

    // private static makePaddlePosition(paddlePos: PaddlePos) : {c: vec2, d: vec2, r: number} {
    //     const paddle = data.paddle;
    //     let c = vec2.create();
    //     let d = vec2.create();
    //     let r : number;
    //     switch (paddlePos) {
    //         case PaddlePos.LeftFront:
    //             c = vec2.fromValues(paddle[0].position[0] + paddle[0].width / 2.0, paddle[0].position[1] - paddle[0].height / 2.0);
    //             d = vec2.fromValues(0, 1);
    //             r = paddle[0].height;
    //             break;
    //         case PaddlePos.LeftUp:
    //             c = vec2.fromValues(paddle[0].position[0] - paddle[0].width / 2.0, paddle[0].position[1] + paddle[0].height / 2.0);
    //             d = vec2.fromValues(1, 0);
    //             r = paddle[0].width;
    //             break;
    //         case PaddlePos.LeftDown:
    //             c = vec2.fromValues(paddle[0].position[0] - paddle[0].width / 2.0, paddle[0].position[1] - paddle[0].height / 2.0);
    //             d = vec2.fromValues(1, 0);
    //             r = paddle[0].width;
    //             break;
    //         case PaddlePos.RightFront:
    //             c = vec2.fromValues(paddle[1].position[0] - paddle[1].width / 2.0, paddle[1].position[1] - paddle[1].height / 2.0);
    //             d = vec2.fromValues(0, 1);
    //             r = paddle[1].height;
    //             break;
    //         case PaddlePos.RightUp:
    //             c = vec2.fromValues(paddle[1].position[0] + paddle[1].width / 2.0, paddle[1].position[1] + paddle[1].height / 2.0);
    //             d = vec2.fromValues(-1, 0);
    //             r = paddle[1].width;
    //             break;
    //         case PaddlePos.RightDown:
    //             c = vec2.fromValues(paddle[1].position[0] + paddle[1].width / 2.0, paddle[1].position[1] - paddle[1].height / 2.0);
    //             d = vec2.fromValues(-1, 0);
    //             r = paddle[1].width;
    //             break;
    //     }
    //     return {c, d, r};
    // }

    // static calCheckConflict(delta: number) {
    //     const paddles = data.paddle;
    //     const ball = data.ball;
    //     const cornerPaddleArray = [
    //         { corner: BallCorner.TopRight, paddlePos: [PaddlePos.RightFront, PaddlePos.RightDown] },
    //         { corner: BallCorner.BottomRight, paddlePos: [PaddlePos.RightFront, PaddlePos.RightUp] },
    //         { corner: BallCorner.BottomLeft, paddlePos: [PaddlePos.LeftFront, PaddlePos.LeftUp] },
    //         { corner: BallCorner.TopLeft, paddlePos: [PaddlePos.LeftFront, PaddlePos.LeftDown] }
    //     ];
    //
    //         for (const { corner, paddlePos } of cornerPaddleArray) {
    //             const ballPos = this.makeBallPosition(corner);
    //
    //             for (const pos of paddlePos) {
    //                 const factor = data.ball.calculateFactor(this._paddlePos);
    //                 const ballDirection = vec2.scale(vec2.create(), ball.direction, ball.velocity * factor);
    //                 const { c, d, r } = this.makePaddlePosition(pos);
    //                 const { p, q } = this.calculateConflict(ballPos, ballDirection, c, d);
    //
    //                 if (!this.checkConflict(p, q, r, delta) && p > 0) {
    //                     return {p, pos}; // 충돌 감지 시 바로 p 반환
    //                 }
    //             }
    //     }
    //     return undefined; // 충돌이 없는 경우
    // }

    static checkItemCollision(delta: number) {
        let items = data.items;
        let collisionResult : {p : number, q : number} | undefined = undefined;

        const paddles = data.paddle;
        for (let i = items.length - 1; i >= 0; i--) {
            let collisionDetected = false;
            const item = items[i];

            if (item.checkWithPaddleCollision(i, delta)) {
                collisionDetected = true;
                break;
            }

            if (!collisionDetected) {
                data.items[i].checkMoved(delta);
            }
        }
        return collisionResult;
    }

    static GuaranteeConflict(delta: number) {
        const p = data.ball.calCheckConflict(delta);

        if (p === undefined) {
            data.ball.updateBallPosition(delta, this._paddlePos);
            return ;
        }
        data.ball.updateBallPosition(p.p, this._paddlePos);
        this.handleBallPaddleCollision();
        const restAfterCollision = delta - p.p;
        this._paddlePos = p.pos;
        this.GuaranteeConflict(restAfterCollision);
    }

    // static calculateFactor(paddlePos: PaddlePos | null) {
    //     let factor;
    //     if (paddlePos === null) {
    //         factor = 1.0;
    //     } else if (paddlePos < 3) {
    //         factor = data.paddle[0].ballVelocityFactor;
    //     } else {
    //         factor = data.paddle[1].ballVelocityFactor;
    //     }
    //     return factor;
    // }
    //
    // static calculateBallPosition(delta: number, factor: number) : vec2 {
    //     const ball = data.ball;
    //     let tempVec2 = vec2.create();
    //     vec2.add(tempVec2, ball.position, vec2.scale(tempVec2, ball.direction, ball.velocity * delta * factor));
    //     return tempVec2;
    // }
    //
    // static updateBallPosition(delta: number) {
    //     const factor = this.calculateFactor(this._paddlePos);
    //     data.ball.position = this.calculateBallPosition(delta, factor);
    // }

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