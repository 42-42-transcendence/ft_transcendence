import {vec2} from "gl-matrix";

export enum BallCorner {
    TopRight,
    BottomRight,
    TopLeft,
    BottomLeft
}

export class Ball {
    position: vec2;
    direction: vec2;
    velocity: number;
    radius: number;
    ballVertices = new Float32Array(12);
    constructor(direction: vec2 = vec2.fromValues(1.0, 0), velocity: number = 2.0, radius: number = 0.02) {
        this.position = vec2.fromValues(0, 0);
        this.direction = direction;
        this.velocity = velocity;
        this.radius = radius; // 공의 반지름
        this.calculateVertices();
    }

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
}