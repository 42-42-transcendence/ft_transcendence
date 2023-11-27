import {vec2} from "gl-matrix";
import {CanvasPosition} from "./GameManager";
import {GameObject} from "./GameObject";

export class Item extends GameObject {
    // position: vec2;
    // direction: vec2;
    // velocity: number;
    // radius: number;
    itemVertices = new Float32Array();
    // constructor(direction: vec2) {
    //     this.position = vec2.fromValues(0, 0);
    //     this.direction = direction;
    //     this.velocity = 1.0;
    //     this.radius = 0.01; // 공의 반지름
    //     this.calculateVertices();
    // }

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