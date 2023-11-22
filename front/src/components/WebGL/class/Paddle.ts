import { vec2 } from "gl-matrix";

export enum PaddlePos{
    LeftFront,
    LeftUp,
    LeftDown,
    RightFront,
    RightUp,
    RightDown
}

export class Paddle {
    position: vec2;
    paddleSpeed: number;
    width: number;
    height: number;
    paddleVertices = new Float32Array();

    constructor(x: number, y: number, width: number = 0.05, height: number = 0.5) {
        this.position = vec2.fromValues(x, y);
        this.paddleSpeed = 1.2;
        this.width = width;
        this.height = height;
        this.calculateVertices();
    }

    public calculateVertices() {
        // 버텍스 계산 로직
        this.paddleVertices = new Float32Array([
            this.position[0] - this.width / 2.0, this.position[1] - this.height / 2.0, // 1
            this.position[0] + this.width / 2.0, this.position[1] - this.height / 2.0, // 2
            this.position[0] - this.width / 2.0, this.position[1] + this.height / 2.0, // 3

            this.position[0] + this.width / 2.0, this.position[1] - this.height / 2.0, // 2
            this.position[0] - this.width / 2.0, this.position[1] + this.height / 2.0, // 3
            this.position[0] + this.width / 2.0, this.position[1] + this.height / 2.0, // 4
        ]);
    }
}