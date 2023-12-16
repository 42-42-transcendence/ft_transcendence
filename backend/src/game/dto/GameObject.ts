import { vec2 } from "gl-matrix";
import { CanvasPosition, ObjectCorner, PaddlePos } from "../enums/gameEnums";
import { GameManager } from "./GameManager";
import { GameDataDto } from "./in-game.dto";
import { Paddle } from "./Paddle";

export abstract class GameObject {
    position: vec2;
    direction: vec2;
    velocity: number;
    radius: number;
    factor: number;
    vertices = new Float32Array(12);

    constructor(position: vec2, direction: vec2, velocity: number, radius: number) {
        this.position = position;
        this.direction = direction;
        this.velocity = velocity;
        this.radius = radius;
        this.factor = 1.0;
    }

    public move(delta: number): void {
        this.position[0] += this.direction[0] * this.velocity * delta * this.factor;
        this.position[1] += this.direction[1] * this.velocity * delta * this.factor;
    }


    public objectInsidePaddle(paddle: Paddle) {
        const paddleHeightHalf = paddle.height / 2.0;
        const paddleWidthHalf = paddle.width / 2.0;

        let paddleTop = paddle.position[1] + paddleHeightHalf;
        let paddleBottom = paddle.position[1] - paddleHeightHalf;
        let paddleLeft = paddle.position[0] - paddleWidthHalf;
        let paddleRight = paddle.position[0] + paddleWidthHalf;

        const objectTop = this.position[1] + this.radius;
        const objectBottom = this.position[1] - this.radius;
        const objectLeft = this.position[0] - this.radius;
        const objectRight = this.position[0] + this.radius;

        return (objectTop > paddleBottom && objectBottom < paddleTop && objectLeft < paddleRight && objectRight > paddleLeft);
    }

    public objectOutsideCanvas() {
        return this.position[0] + this.radius > 1.0 || this.position[0] - this.radius < -1.0 ||
            this.position[1] + this.radius > 1.0 || this.position[1] - this.radius < -1.0;
    }

    protected crossProduct = (a: vec2, b: vec2): number => a[0] * b[1] - a[1] * b[0];

    protected calculateCollision(a: vec2, b: vec2, c : vec2, d :vec2) {
        const crossB_D = this.crossProduct(b, d);
        const crossD_B = this.crossProduct(d, b);
        if (crossB_D === 0 || crossD_B === 0) {
            return { p: -1, q: -1 };
        }
        const p = (this.crossProduct(vec2.sub(vec2.create(), c, a), d)) / crossB_D;
        const q = (this.crossProduct(vec2.sub(vec2.create(), a, c), b)) / crossD_B;
        return {p, q};
    }

    protected checkCollision(p: number, q: number, l: number, delta: number) : boolean {
        return (q >= 0 && q <= l) && p < delta && p > 0;
    }

    public checkWithPaddleCollision(delta: number, paddle: Paddle[]) {
        const cornerPaddleArray = [
            { corner: ObjectCorner.TopRight, paddlePos: [PaddlePos.RightFront, PaddlePos.RightDown] },
            { corner: ObjectCorner.BottomRight, paddlePos: [PaddlePos.RightFront, PaddlePos.RightUp] },
            { corner: ObjectCorner.BottomLeft, paddlePos: [PaddlePos.LeftFront, PaddlePos.LeftUp] },
            { corner: ObjectCorner.TopLeft, paddlePos: [PaddlePos.LeftFront, PaddlePos.LeftDown] }
        ];

        for (const { corner, paddlePos } of cornerPaddleArray) {
            const ballPos = this.makeObjectPosition(corner);

            for (const pos of paddlePos) {
                const ballDirection = vec2.scale(vec2.create(), this.direction, this.velocity * this.factor);
                const { c, d, r } = this.makePaddlePosition(pos, paddle);
                const { p, q } = this.calculateCollision(ballPos, ballDirection, c, d);

                if (this.checkCollision(p, q, r, delta)) {
                    return {p, pos};
                }
            }
        }
        return undefined; // 충돌이 없는 경우
    }

    public checkWithWallCollision(delta: number) : {p : number, pos : CanvasPosition} | undefined {
        const cornerCanvasArray = [
            { corner: ObjectCorner.TopRight, canvasPos: [CanvasPosition.Top, CanvasPosition.Right] },
            { corner: ObjectCorner.BottomRight, canvasPos: [CanvasPosition.Right, CanvasPosition.Bottom] },
            { corner: ObjectCorner.BottomLeft, canvasPos: [CanvasPosition.Left, CanvasPosition.Bottom] },
            { corner: ObjectCorner.TopLeft, canvasPos: [CanvasPosition.Left, CanvasPosition.Top]}
        ];

        let minCollisionResult = { p: Number.MAX_VALUE, pos: CanvasPosition.Top }; // 초기화

        for (const { corner, canvasPos } of cornerCanvasArray) {
            const objectPos = this.makeObjectPosition(corner);

            for (const pos of canvasPos) {
                const objectDirection = vec2.scale(vec2.create(), this.direction, this.velocity * this.factor);
                const { c, d, r } = this.makeCanvasPosition(pos);
                const { p, q } = this.calculateCollision(objectPos, objectDirection, c, d);

                if (this.checkCollision(p, q, r, delta) && p < minCollisionResult.p) {
                    minCollisionResult = { p, pos };
                }
            }
        }
        return minCollisionResult.p !== Number.MAX_VALUE ? minCollisionResult : undefined;
    }

    public clampWithPaddle() {
        this.move(0.0001);
    }

    public clampWithWall() {
        console.log("clampWithWall");
        const min = -1.0 + this.radius * 1.1;
        const max = 1.0 - this.radius * 1.1;
        const x = this.clamp(this.position[0], min, max);
        const y = this.clamp(this.position[1], min, max);
        this.position = vec2.fromValues(x, y);
    }

    private clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    public handleWithWallCollision(side: CanvasPosition, gamedata: GameDataDto) {
        console.error("handleWithWallCollision is not implemented");
        return false;
    }

    public handleWithPaddleCollision(paddlePos: PaddlePos, paddle: Paddle[]) {
        console.error("handleWithPaddleCollision is not implemented");
        return false;
    }

    protected makePaddlePosition(paddlePos: PaddlePos, dataPaddle: Paddle[]) : {c: vec2, d: vec2, r: number} {
        const paddle = dataPaddle;
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

    protected makeCanvasPosition(canvasPosition: CanvasPosition) {
        let c ;
        let d;
        let r = 2.0;

        switch (canvasPosition) {
            case CanvasPosition.Top:
                c = vec2.fromValues(1.0, 1.0);
                d = vec2.fromValues(-1.0, 0.0);
                break;
            case CanvasPosition.Right:
                c = vec2.fromValues(1.0, -1.0);
                d = vec2.fromValues(0.0, 1.0);
                break;
            case CanvasPosition.Left:
                c = vec2.fromValues(-1.0, 1.0);
                d = vec2.fromValues(0.0, -1.0);
                break;
            case CanvasPosition.Bottom:
                c = vec2.fromValues(-1.0, -1.0);
                d = vec2.fromValues(1.0, 0.0);
                break;
        }
        return {c, d, r};
    }

    protected makeObjectPosition(objectCorner: ObjectCorner) : vec2 {
        switch (objectCorner) {
            case ObjectCorner.TopRight:
                return vec2.fromValues(this.position[0] + this.radius, this.position[1] + this.radius);
            case ObjectCorner.BottomRight:
                return vec2.fromValues(this.position[0] + this.radius, this.position[1] - this.radius);
            case ObjectCorner.TopLeft:
                return vec2.fromValues(this.position[0] - this.radius, this.position[1] + this.radius);
            case ObjectCorner.BottomLeft:
                return vec2.fromValues(this.position[0] - this.radius, this.position[1] - this.radius);
        }
    }
}