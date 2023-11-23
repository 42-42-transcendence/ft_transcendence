import {vec2} from "gl-matrix";

export class Item {
    position: vec2;
    direction: vec2;
    velocity: number;
    radius: number;
    itemVertices = new Float32Array();
    constructor(direction: vec2) {
        this.position = vec2.fromValues(0, 0);
        this.direction = direction;
        this.velocity = 1.0;
        this.radius = 0.02; // 공의 반지름
        this.calculateVertices();
    }

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

    public move(delta: number) {
        this.position[0] += this.direction[0] * this.velocity * delta;
        this.position[1] += this.direction[1] * this.velocity * delta;
        this.calculateVertices();
    }
}