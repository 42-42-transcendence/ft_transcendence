import { vec2 } from "gl-matrix";

export class Paddle {
    position: vec2;
    paddleSpeed: number;
    width: number;
    height: number;
    ballVelocityFactor: number;
    keyPress: {up: boolean, down: boolean};
    paddleVertices = new Float32Array(12);

    constructor(x: number, y: number, width: number = 0.05, height: number = 0.5) {
        this.position = vec2.fromValues(x, y);
        this.paddleSpeed = 1.0;
        this.ballVelocityFactor = 1.0;
        this.width = width;
        this.height = height;
        this.keyPress = {up: false, down: false};
        this.calculateVertices();
    }

    public calculateVertices() {
        // 버텍스 계산 로직
        this.paddleVertices.set([
            this.position[0] - this.width / 2.0, this.position[1] - this.height / 2.0, // 1
            this.position[0] + this.width / 2.0, this.position[1] - this.height / 2.0, // 2
            this.position[0] - this.width / 2.0, this.position[1] + this.height / 2.0, // 3

            this.position[0] + this.width / 2.0, this.position[1] - this.height / 2.0, // 2
            this.position[0] - this.width / 2.0, this.position[1] + this.height / 2.0, // 3
            this.position[0] + this.width / 2.0, this.position[1] + this.height / 2.0, // 4
        ]);
    }

    public updatePosition(delta: number) {
        if (this.keyPress.up) {
            this.position[1] += this.paddleSpeed * delta
        } else if (this.keyPress.down) {
            this.position[1] -= this.paddleSpeed * delta;
        } else {
            this.position[1] += 0;
        }

        /* 패들 위치 제한 */
        if (this.position[1] - this.height / 2.0 < -1.0) {
            this.position[1] = -1.0 + this.height / 2.0;
        }
        if (this.position[1] + this.height / 2.0 > 1.0)
            this.position[1] = 1.0 - this.height / 2.0;
    }
}