import { vec2 } from "gl-matrix";
import {CanvasPosition} from "./GameManager";
import {PaddlePos} from "./Paddle";
import data from "../interface/gameData";
// import {BallCorner} from "./Ball";

export enum BallCorner {
    TopRight,
    BottomRight,
    TopLeft,
    BottomLeft
}

export abstract class GameObject {
    position: vec2;
    direction: vec2;
    velocity: number;
    radius: number;

    constructor(position: vec2, direction: vec2, velocity: number, radius: number) {
        this.position = position;
        this.direction = direction;
        this.velocity = velocity;
        this.radius = radius;
        // calculateVertices();
    }

    // public move(delta: number): void {
    //     this.position[0] += this.direction[0] * this.velocity * delta;
    //     this.position[1] += this.direction[1] * this.velocity * delta;
    // }

    protected makeCanvasPosition(canvasPosition: CanvasPosition) {
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

    protected crossProduct = (a: vec2, b: vec2): number => a[0] * b[1] - a[1] * b[0];

    protected calculateConflict(a: vec2, b: vec2, c : vec2, d :vec2) {
        const crossB_D = this.crossProduct(b, d);
        if (crossB_D === 0) {
            return { p: -1, q: -1 };
        }
        const p = (this.crossProduct(vec2.sub(vec2.create(), c, a), d)) / this.crossProduct(b, d);
        const q = (this.crossProduct(vec2.sub(vec2.create(), a, c), b)) / this.crossProduct(d, b);
        return {p, q};
    }

    protected checkConflict(p: number, q: number, l: number, delta: number) : boolean {
        return (q < 0 || q > l) || p > delta || p < 0;
    }

    protected makePaddlePosition(paddlePos: PaddlePos) : {c: vec2, d: vec2, r: number} {
        const paddle = data.paddle;
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

    protected makeBallPosition(ballCorner: BallCorner) : vec2 {
        switch (ballCorner) {
            case BallCorner.TopRight:
                return vec2.fromValues(this.position[0] + this.radius, this.position[1] + this.radius);
            case BallCorner.BottomRight:
                return vec2.fromValues(this.position[0] + this.radius, this.position[1] - this.radius);
            case BallCorner.TopLeft:
                return vec2.fromValues(this.position[0] - this.radius, this.position[1] + this.radius);
            case BallCorner.BottomLeft:
                return vec2.fromValues(this.position[0] - this.radius, this.position[1] - this.radius);
        }
    }
}