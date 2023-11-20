import {vec2} from "gl-matrix";

export class Ball {
    position: vec2;
    direction: vec2;
    velocity: number;
    radius: number;
    ballVertices = new Float32Array();
    constructor() {
        this.position = vec2.fromValues(0, 0);
        this.direction = vec2.fromValues(1.0, 0);
        this.velocity = 2.0;
        this.radius = 0.02; // 공의 반지름
        this.calculateVertices();
    }

    public calculateVertices() {
        this.ballVertices = new Float32Array([
            this.position[0] - this.radius, this.position[1] + this.radius,  // 1
            this.position[0] + this.radius, this.position[1] + this.radius,  // 2
            this.position[0] - this.radius, this.position[1] - this.radius,   // 3

            this.position[0] + this.radius, this.position[1] + this.radius,  // 2
            this.position[0] - this.radius, this.position[1] - this.radius,   // 3
            this.position[0] + this.radius, this.position[1] - this.radius,    // 4
        ]);
    }
}
export default Ball;