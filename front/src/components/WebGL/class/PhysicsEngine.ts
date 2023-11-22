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

    private static calculateConflict(a: vec2, b: vec2, c : vec2, d :vec2) {
        const crossB_D = this.crossProduct(b, d);
        if (crossB_D === 0) {
            return { p: -1, q: -1 };
        }
        const p = (this.crossProduct(vec2.sub(vec2.create(), c, a), d)) / this.crossProduct(b, d);
        const q = (a[1] + p * b[1] - c[1]) / d[1];
        return {p, q};
    }

    private static checkConflict(p: number, q: number, l: number, delta: number) : boolean {
        return (q < 0 || q > l) || p > delta || p < 0;
    }

    private static makeBallPosition(ball: Ball, ballCorner: BallCorner) : vec2 {
        switch (ballCorner) {
            case BallCorner.TopRight:
                return vec2.fromValues(ball.position[0] + ball.radius, ball.position[1] + ball.radius);
            case BallCorner.BottomRight:
                return vec2.fromValues(ball.position[0] + ball.radius, ball.position[1] - ball.radius);
            case BallCorner.TopLeft:
                return vec2.fromValues(ball.position[0] - ball.radius, ball.position[1] + ball.radius);
            case BallCorner.BottomLeft:
                return vec2.fromValues(ball.position[0] - ball.radius, ball.position[1] - ball.radius);
        }
    }

    private static makePaddlePosition(paddle: Paddle[], paddlePos: PaddlePos) : {c: vec2, d: vec2, r: number} {
        let c = vec2.create();
        let d = vec2.create();
        let r : number;
        switch (paddlePos) {
            case PaddlePos.LeftFront:
                c = vec2.fromValues(paddle[0].position[0] + paddle[0].width / 2.0, paddle[0].position[1] - paddle[0].height / 2.0);
                d = vec2.fromValues(0, 1);
                r = paddle[0].height;
                break;
            case PaddlePos.LeftUp:
                c = vec2.fromValues(paddle[0].position[0] - paddle[0].width / 2.0, paddle[0].position[1] + paddle[0].height / 2.0);
                d = vec2.fromValues(1, 0);
                r = paddle[0].width;
                break;
            case PaddlePos.LeftDown:
                c = vec2.fromValues(paddle[0].position[0] - paddle[0].width / 2.0, paddle[0].position[1] - paddle[0].height / 2.0);
                d = vec2.fromValues(1, 0);
                r = paddle[0].width;
                break;
            case PaddlePos.RightFront:
                c = vec2.fromValues(paddle[1].position[0] - paddle[1].width / 2.0, paddle[1].position[1] - paddle[1].height / 2.0);
                d = vec2.fromValues(0, 1);
                r = paddle[1].height;
                break;
            case PaddlePos.RightUp:
                c = vec2.fromValues(paddle[1].position[0] + paddle[1].width / 2.0, paddle[1].position[1] + paddle[1].height / 2.0);
                d = vec2.fromValues(-1, 0);
                r = -paddle[1].width;
                break;
            case PaddlePos.RightDown:
                c = vec2.fromValues(paddle[1].position[0] + paddle[1].width / 2.0, paddle[1].position[1] - paddle[1].height / 2.0);
                d = vec2.fromValues(-1, 0);
                r = -paddle[1].width;
                break;
        }
        return {c, d, r};
    }
    static calCheckConflict(ball: Ball, delta: number, paddle: Paddle[]) {
        let closestP = -1; // 초기에는 충돌이 없음을 가정

        // 공의 모서리와 관련된 패들 부분 매핑
        const cornerPaddleMapping = new Map<BallCorner, PaddlePos[]>([
            [BallCorner.TopRight, [PaddlePos.RightFront, PaddlePos.RightUp]],
            [BallCorner.BottomRight, [PaddlePos.RightFront, PaddlePos.RightDown]],
            [BallCorner.BottomLeft, [PaddlePos.LeftFront, PaddlePos.LeftDown]],
            [BallCorner.TopLeft, [PaddlePos.LeftFront, PaddlePos.LeftUp]],
        ]);

        cornerPaddleMapping.forEach((paddlePositions, ballCorner) => {
            const ballPos = this.makeBallPosition(ball, ballCorner);
            const ballDirection = vec2.scale(vec2.create(), ball.direction, ball.velocity);

            paddlePositions.forEach(paddlePos => {
                const { c, d , r} = this.makePaddlePosition(paddle, paddlePos);
                const { p, q } = this.calculateConflict(ballPos, ballDirection, c, d);
                console.log((q > 0 && q < r) && p < delta && p > 0);
                if (!this.checkConflict(p, q, r, delta)) {
                    if ((closestP === -1 || p < closestP) && p > 0) {
                        closestP = p; // 가장 빠른 충돌 시간 갱신
                    }
                }
            });
        });
        return closestP;
    }

    static GuaranteeConflict(ball: Ball, delta: number) {
        /* 충돌이 없다면 */
        const p = this.calCheckConflict(ball, delta, data.paddle);
        if (p === -1) {
            this.updateBallPosition(delta);
            return ;
        }
        this.updateBallPosition(p);
        this.handleBallPaddleCollision()
        const restAfterCollision = delta - p;
        this.updateBallPosition(restAfterCollision);
        // this.GuaranteeConflict(ball, restAfterCollision);
        // 게런티로 줬을 떄, 가끔 멈춰서 무한히 공이 멈추는데, 이유 찾아야함.
        // 해결 후, 상하 라인 충돌도 구현.
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