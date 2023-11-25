import {vec2} from "gl-matrix";
import data from "../interface/gameData";
import {Ball, BallCorner} from "./Ball";
import {Paddle, PaddlePos} from "./Paddle";
import {Item} from "./Item";
import {CanvasPosition} from "./GameManager";

class PhysicsEngine {
    static _paddlePos : PaddlePos | null = null;
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
        const q = (this.crossProduct(vec2.sub(vec2.create(), a, c), b)) / this.crossProduct(d, b);
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
                r = paddle[1].width;
                break;
            case PaddlePos.RightDown:
                c = vec2.fromValues(paddle[1].position[0] + paddle[1].width / 2.0, paddle[1].position[1] - paddle[1].height / 2.0);
                d = vec2.fromValues(-1, 0);
                r = paddle[1].width;
                break;
        }
        return {c, d, r};
    }

    private static makeCanvasPosition(canvasPosition: CanvasPosition) {
        let c = vec2.create();
        let d = vec2.create();
        let r = 2.0;

        switch (canvasPosition) {
            case CanvasPosition.TopRight:
                c = vec2.fromValues(1.0, 1.0);
                d = vec2.fromValues(-1.0, 0.0);
                break;
            case CanvasPosition.BottomRight:
                c = vec2.fromValues(1.0, -1.0);
                d = vec2.fromValues(0.0, 1.0);
                break;
            case CanvasPosition.TopLeft:
                c = vec2.fromValues(-1.0, 1.0);
                d = vec2.fromValues(0.0, -1.0);
                break;
            case CanvasPosition.BottomLeft:
                c = vec2.fromValues(-1.0, -1.0);
                d = vec2.fromValues(1.0, 0.0);
                break;
        }
        return {c, d, r};
    }

    private static checkAndHandleWallCollision(item: Item, delta: number) {
        const a = vec2.fromValues(item.position[0], item.position[1]);
        const b = vec2.fromValues(item.direction[0], item.direction[1]);

        // 캔버스 경계(벽) 설정
        const walls = [
            CanvasPosition.TopLeft,
            CanvasPosition.BottomRight,
            CanvasPosition.TopRight,
            CanvasPosition.BottomLeft,
        ];

        // 각 벽과의 충돌 검사
        walls.forEach(wall => {
            const {r, c, d} = this.makeCanvasPosition(wall);
            const {p, q} = this.calculateConflict(a, b, c, d);

            if (!this.checkConflict(p, q, r, delta)) {
                if (wall === walls[0] || wall === walls[1]) {
                    item.direction[0] *= -1;
                } else {
                    item.direction[1] *= -1;
                }
            }
        });
    }

    static calCheckConflict(ball: Ball, delta: number, paddle: Paddle[]) {
        const cornerPaddleArray = [
            { corner: BallCorner.TopRight, paddlePos: [PaddlePos.RightFront, PaddlePos.RightDown] },
            { corner: BallCorner.BottomRight, paddlePos: [PaddlePos.RightFront, PaddlePos.RightUp] },
            { corner: BallCorner.BottomLeft, paddlePos: [PaddlePos.LeftFront, PaddlePos.LeftUp] },
            { corner: BallCorner.TopLeft, paddlePos: [PaddlePos.LeftFront, PaddlePos.LeftDown] }
        ];

            for (const { corner, paddlePos } of cornerPaddleArray) {
                const ballPos = this.makeBallPosition(ball, corner);

                for (const pos of paddlePos) {
                    const factor = this.calculateFactor(this._paddlePos);
                    const ballDirection = vec2.scale(vec2.create(), ball.direction, ball.velocity * factor);
                    const { c, d, r } = this.makePaddlePosition(paddle, pos);
                    const { p, q } = this.calculateConflict(ballPos, ballDirection, c, d);

                    if (!this.checkConflict(p, q, r, delta) && p > 0) {
                        return {p, pos}; // 충돌 감지 시 바로 p 반환
                    }
                }
        }
        return -1; // 충돌이 없는 경우
    }

    static checkItemCollision(items: Item[], paddles: Paddle[], delta: number) {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            let collisionDetected = false;

            for (let j = 0; j < paddles.length; j++) {
                const paddle = paddles[j];
                const paddlePositions = this.getPaddlePositions(j); // 패들의 모든 위치를 가져옴

                for (const pos of paddlePositions) {
                    if (this.isColliding(item, delta, pos)) {
                        this.applyEffectToPaddle(paddle);
                        items.splice(i, 1);
                        collisionDetected = true;
                        break; // 충돌 감지되면 내부 루프 종료
                    }
                }
                if (collisionDetected) break; // 충돌 감지되면 외부 루프 종료
            }

            if (!collisionDetected) {
                this.checkAndHandleWallCollision(item, delta);
                item.move(delta);
            }
        }
    }

    private static getPaddlePositions(index: number): PaddlePos[] {
        if (index === 0) { // 왼쪽 패들
            return [PaddlePos.LeftFront, PaddlePos.LeftUp, PaddlePos.LeftDown];
        } else { // 오른쪽 패들
            return [PaddlePos.RightFront, PaddlePos.RightUp, PaddlePos.RightDown];
        }
    }

    private static isColliding(item: Item, delta: number, paddlePos: PaddlePos) : boolean {
        const a = vec2.fromValues(item.position[0], item.position[1]);
        const b = vec2.fromValues(item.direction[0], item.direction[1]);
        const {c, d, r} = this.makePaddlePosition(data.paddle, paddlePos);

        const {p, q} = this.calculateConflict(a, b, c, d);
        return !this.checkConflict(p, q, r, delta);
    }

    private static applyEffectToPaddle(paddle: Paddle) {
        let rand = Math.random() * 3;
        if (rand < 1) {
            if (paddle.height < 0.8)
                paddle.height += 0.05;
            console.log("패들 길이 증가!");
        } else if (rand < 2) {
            if (paddle.paddleSpeed < 2.0)
                paddle.paddleSpeed += 0.12;
            console.log("패들 속도 증가!");
        } else {
            if (paddle.ballVelocityFactor < 3.0)
                paddle.ballVelocityFactor += 0.1;
            console.log("공 속도 증가!");
        }
    }

    static GuaranteeConflict(ball: Ball, delta: number) {
        const p = this.calCheckConflict(ball, delta, data.paddle);

        if (p === -1) {
            this.updateBallPosition(delta);
            return ;
        }
        this.updateBallPosition(p.p);
        this.handleBallPaddleCollision();
        const restAfterCollision = delta - p.p;
        this._paddlePos = p.pos;
        this.GuaranteeConflict(ball, restAfterCollision);
        // 상하 라인 충돌도 구현.
    }

    static calculateFactor(paddlePos: PaddlePos | null) {
        let factor;
        if (null === paddlePos) {
            factor = 1.0;
        } else if (paddlePos < 3) {
            factor = data.paddle[0].ballVelocityFactor;
        } else {
            factor = data.paddle[1].ballVelocityFactor;
        }
        return factor;
    }

    static calculateBallPosition(ball: Ball, delta: number, factor: number) : vec2 {
        let tempVec2 = vec2.create();
        vec2.add(tempVec2, ball.position, vec2.scale(tempVec2, ball.direction, ball.velocity * delta * factor));
        return tempVec2;
    }

    static updateBallPosition(delta: number) {
        const factor = this.calculateFactor(this._paddlePos);
        data.ball.position = this.calculateBallPosition(data.ball, delta, factor);
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