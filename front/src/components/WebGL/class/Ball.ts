import {vec2} from "gl-matrix";
import {PaddlePos} from "./Paddle";
import data from "../interface/gameData";
import {GameObject, BallCorner} from "./GameObject";

export class Ball extends GameObject{
    // position: vec2;
    // direction: vec2;
    // velocity: number;
    // radius: number;
    ballVertices = new Float32Array(12);
    // constructor(direction: vec2 = vec2.fromValues(1.0, 0), velocity: number = 2.0, radius: number = 0.02) {
    //     this.position = vec2.fromValues(0, 0);
    //     this.direction = direction;
    //     this.velocity = velocity;
    //     this.radius = radius; // 공의 반지름
    //     this.calculateVertices();
    // }

    public calculateVertices() {
        this.ballVertices.set([
            this.position[0] - this.radius, this.position[1] + this.radius,  // 1
            this.position[0] + this.radius, this.position[1] + this.radius,  // 2
            this.position[0] - this.radius, this.position[1] - this.radius,   // 3

            this.position[0] + this.radius, this.position[1] + this.radius,  // 2
            this.position[0] - this.radius, this.position[1] - this.radius,   // 3
            this.position[0] + this.radius, this.position[1] - this.radius,    // 4
        ]);
    }

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
        data.ball.position = this.calculateBallPosition(delta, factor);
    }

    public calCheckConflict(delta: number, paddlePos: PaddlePos | null) {
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
                const { p, q } = this.calculateConflict(ballPos, ballDirection, c, d);

                if (!this.checkConflict(p, q, r, delta) && p > 0) {
                    return {p, pos}; // 충돌 감지 시 바로 p 반환
                }
            }
        }
        return undefined; // 충돌이 없는 경우
    }
}