import {GameObject} from "./GameObject";
import {Paddle} from "./Paddle";
import data from "../interface/gameData";

class PhysicsEngine {
    static GuaranteeConflict(object: GameObject, delta: number, depth: number = 0) {
        console.log("delta : " + delta);
        if (depth > 10) {
            console.log("Depth over: " + object.position[0] + " " + object.position[1]);
            console.log("Direction: " + object.direction[0] + " " + object.direction[1]);
            console.log("Velocity: " + object.velocity);
            console.log("factor: " + object.factor);
            console.log("P: " + delta);
            while (true) {}
            return;
        }

        const collisionProcesses = [
            {
                checkCollision: () => object.checkWithPaddleCollision(delta),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithPaddleCollision(collisionResult.pos),
                CheckObjectInside: () => object.objectInsidePaddle(data.paddle[0]) || object.objectInsidePaddle(data.paddle[1]),
            },
            {
                checkCollision: () => object.checkWithWallCollision(delta),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithWallCollision(collisionResult.pos),
                CheckObjectInside: () => object.objectInsideCanvas(),
            }
        ];

        for (const process of collisionProcesses) {
            const collisionResult = process.checkCollision();
            if (collisionResult !== undefined) {
                object.move(collisionResult.p);
                if (process.handleCollision(collisionResult))
                    return;
                if (process.CheckObjectInside())
                    object.move(0.0001);
                const restAfterCollision = delta - collisionResult.p;
                this.GuaranteeConflict(object, restAfterCollision, depth + 1);
                return;
            }
        }
        object.move(delta);
    }
}

interface CollisionResult {
    p: number;
    pos: any;
}
export default PhysicsEngine;