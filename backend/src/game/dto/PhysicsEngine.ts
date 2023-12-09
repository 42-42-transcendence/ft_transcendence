import { GameObject } from "./GameObject";
import { gamedata, sendGameData } from "./in-game.dto";

class PhysicsEngine {
    static GuaranteeConflict(object: GameObject, delta: number, depth: number = 0) {
        if (depth > 30) {
            console.log("depth over 30");
        }

        const collisionProcesses = [
            {
                checkCollision: () => object.checkWithPaddleCollision(delta),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithPaddleCollision(collisionResult.pos),
                CheckObjectInside: () => object.objectInsidePaddle(gamedata.paddle[0]) || object.objectInsidePaddle(gamedata.paddle[1]),
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
                    process.clamp(collisionResult);
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