import { vec2 } from "gl-matrix";
import {CanvasPosition} from "./GameManager";
export class GameObject {
    position: vec2;
    direction: vec2;
    velocity: number;
    radius: number;

    constructor(position: vec2, direction: vec2, velocity: number, radius: number) {
        this.position = position;
        this.direction = direction;
        this.velocity = velocity;
        this.radius = radius;
    }

    // public move(delta: number): void {
    //     this.position[0] += this.direction[0] * this.velocity * delta;
    //     this.position[1] += this.direction[1] * this.velocity * delta;
    // }

    public makeCanvasPosition(canvasPosition: CanvasPosition) {
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

    public crossProduct = (a: vec2, b: vec2): number => a[0] * b[1] - a[1] * b[0];

    public calculateConflict(a: vec2, b: vec2, c : vec2, d :vec2) {
        const crossB_D = this.crossProduct(b, d);
        if (crossB_D === 0) {
            return { p: -1, q: -1 };
        }
        const p = (this.crossProduct(vec2.sub(vec2.create(), c, a), d)) / this.crossProduct(b, d);
        const q = (this.crossProduct(vec2.sub(vec2.create(), a, c), b)) / this.crossProduct(d, b);
        return {p, q};
    }

    public checkConflict(p: number, q: number, l: number, delta: number) : boolean {
        return (q < 0 || q > l) || p > delta || p < 0;
    }
}