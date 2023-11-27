import {vec2} from "gl-matrix";
import {CanvasPosition} from "./GameManager";
import {GameObject} from "./GameObject";
import data from "../interface/gameData";
import {Paddle, PaddlePos} from "./Paddle";

export class Item extends GameObject {
    itemVertices = new Float32Array();

    public calculateVertices() {
        this.itemVertices = new Float32Array([
            this.position[0] - this.radius, this.position[1] + this.radius,  // 1
            this.position[0] + this.radius, this.position[1] + this.radius,  // 2
            this.position[0] - this.radius, this.position[1] - this.radius,   // 3

            this.position[0] + this.radius, this.position[1] + this.radius,  // 2
            this.position[0] - this.radius, this.position[1] - this.radius,   // 3
            this.position[0] + this.radius, this.position[1] - this.radius,    // 4
        ]);
    }

    private getPaddlePositions(index: number): PaddlePos[] {
        if (index === 0) { // 왼쪽 패들
            return [PaddlePos.LeftFront, PaddlePos.LeftUp, PaddlePos.LeftDown];
        } else { // 오른쪽 패들
            return [PaddlePos.RightFront, PaddlePos.RightUp, PaddlePos.RightDown];
        }
    }

    private isColliding(delta: number, paddlePos: PaddlePos) : {p : number, q : number} | undefined {
        const a = vec2.fromValues(this.position[0], this.position[1]);
        const b = vec2.fromValues(this.direction[0], this.direction[1]);
        const {c, d, r} = this.makePaddlePosition(paddlePos);

        const {p, q} = this.calculateConflict(a, b, c, d);
        if (!this.checkConflict(p, q, r, delta))
            return {p, q};
        return undefined;
    }

    private applyItemEffectToPaddle(paddle: Paddle) {
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

    public checkWithPaddleCollision(idx: number, delta: number) {
        const items = data.items;
        const paddles = data.paddle;

        for (let j = 0; j < paddles.length; j++) {
            const paddle = paddles[j];
            const paddlePositions = this.getPaddlePositions(j); // 패들의 모든 위치를 가져옴

            for (const pos of paddlePositions) {
                const collisionResult = this.isColliding(delta, pos);
                if (collisionResult !== undefined) {
                    this.applyItemEffectToPaddle(paddle);
                    items.splice(idx, 1);
                    return true;
                }
            }
        }
        return false;
    }

    private checkAndHandleWallCollision(delta: number) : {p : number, q : number, side: boolean} | undefined {
        const a = vec2.fromValues(this.position[0], this.position[1]);
        const b = vec2.fromValues(this.direction[0], this.direction[1]);

        const walls = [
            CanvasPosition.TopLeft,
            CanvasPosition.BottomRight,
            CanvasPosition.TopRight,
            CanvasPosition.BottomLeft,
        ];

        for (const wall of walls) {
            const {c, d, r} = this.makeCanvasPosition(wall);
            const {p, q} = this.calculateConflict(a, b, c, d);

            if (!this.checkConflict(p, q, r, delta)) {
                let side = wall === walls[2] || wall === walls[3];
                return {p, q, side};
            }
        }
        return undefined;
    }

    public checkMoved(delta: number) {
        const collisionResultInWall = this.checkAndHandleWallCollision(delta);
        if (collisionResultInWall === undefined) {
            this.move(delta);
            return;
        }

        this.move(collisionResultInWall.p);
        if (!collisionResultInWall.side) {
            this.direction[0] *= -1;
        } else {
            this.direction[1] *= -1;
        }
        const restAfterCollision = delta - collisionResultInWall.p;
        this.move(0.001);
        this.checkMoved(restAfterCollision);
    }

    public move(delta: number) {
        this.position[0] += this.direction[0] * this.velocity * delta;
        this.position[1] += this.direction[1] * this.velocity * delta;
        this.calculateVertices();
    }
}