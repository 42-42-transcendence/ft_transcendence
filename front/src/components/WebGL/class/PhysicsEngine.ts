import {GameObject} from "./GameObject";
import data from "../interface/gameData";

class PhysicsEngine {
    static GuaranteeConflict(object: GameObject, delta: number, depth: number = 0) {
        if (depth > 30) {
            console.log("depth over 30");
        }

        const collisionProcesses = [
            {
                checkCollision: () => object.checkWithPaddleCollision(delta),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithPaddleCollision(collisionResult.pos),
                CheckObjectInside: () => object.objectInsidePaddle(data.paddle[0]) || object.objectInsidePaddle(data.paddle[1]),
                clamp: (collisionResult: CollisionResult) => object.clampWithPaddle(collisionResult.pos),
            },
            {
                checkCollision: () => object.checkWithWallCollision(delta),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithWallCollision(collisionResult.pos),
                CheckObjectInside: () => object.objectOutsideCanvas(),
                clamp: (collisionResult: CollisionResult) => object.clampWithWall(collisionResult.pos),
            }
        ];

        for (const process of collisionProcesses) {
            const collisionResult = process.checkCollision();
            if (collisionResult !== undefined) {
                object.move(collisionResult.p);
                if (process.handleCollision(collisionResult))
                    return;
                // object.position =
                if (process.CheckObjectInside()) {
                    console.log("object inside");
                    process.clamp(collisionResult);
                    console.log("chang pos: " + object.position[0], object.position[1]);
                }
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