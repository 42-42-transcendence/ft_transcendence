import {vec2} from "gl-matrix";
import {Paddle, PaddlePos} from "./Paddle";
import data from "../interface/gameData";
import {GameObject, BallCorner} from "./GameObject";

export class Ball extends GameObject{
    public calculateFactor(paddlePos: PaddlePos | null) {
        let factor;
        if (paddlePos === null) {
            factor = 1.0;
        } else if (paddlePos < 3) {
            factor = data.paddle[0].ballVelocityFactor;
        } else {
            factor = data.paddle[1].ballVelocityFactor;
        }
        return factor;
    }

    private calculateBallPosition(delta: number, factor: number) : vec2 {
        let tempVec2 = vec2.create();
        vec2.add(tempVec2, this.position, vec2.scale(tempVec2, this.direction, this.velocity * delta * factor));
        return tempVec2;
    }

    public updateBallPosition(delta: number, paddlePos: PaddlePos | null) {
        const factor = this.calculateFactor(paddlePos);
        this.position = this.calculateBallPosition(delta, factor);
    }

    public calCheckCollision(delta: number, paddlePos: PaddlePos | null) {
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

    public handleBallWallCollision() {
        if (this.position[1] + this.radius > 1.0 || this.position[1] - this.radius < -1.0) {
            this.direction[1] *= -1; // 위, 아래 벽에 닿을 경우 공의 반사를 구현 (정반사)
        }
    }

    public checkBallPaddleCollision(paddle: Paddle) {
        const paddleHeightHalf = paddle.height / 2.0;
        const paddleWidthHalf = paddle.width / 2.0;
        let paddleTop = paddle.position[1] + paddleHeightHalf;
        let paddleBottom = paddle.position[1] - paddleHeightHalf;
        let paddleLeft = paddle.position[0] - paddleWidthHalf;
        let paddleRight = paddle.position[0] + paddleWidthHalf;

        const BallTop = this.position[1] + this.radius;
        const BallBottom = this.position[1] - this.radius;
        const BallLeft = this.position[0] - this.radius;
        const BallRight = this.position[0] + this.radius;

        return (BallTop > paddleBottom && BallBottom < paddleTop && BallLeft < paddleRight && BallRight > paddleLeft);
    }
    public handleBallPaddleCollision() : boolean {
        const paddle = data.paddle;

        for (let i = 0; i < 2; i++) {
            if (this.checkBallPaddleCollision(paddle[i])) {
                let normalReflect = vec2.fromValues(i === 0 ? 1 : -1, 0); // 왼쪽 패들이면 1, 오른쪽 패들이면 -1
                normalReflect[1] = (this.position[1] - paddle[i].position[1]) / paddle[i].height * 4.0;
                vec2.normalize(this.direction, normalReflect);
                return true;
            }
        }
        return false;
    }
}