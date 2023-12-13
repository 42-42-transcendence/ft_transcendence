import { GameObject } from "./GameObject";
import { GameDataDto } from "./in-game.dto";

class PhysicsEngine {
    static GuaranteeConflict(object: GameObject, data: GameDataDto, delta: number, depth: number = 0) {
        if (depth > 30) {
            console.log("depth over 30");
            return ;
        } //

        const collisionProcesses = [
            {
                checkCollision: () => object.checkWithPaddleCollision(delta, data),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithPaddleCollision(collisionResult.pos, data),
                CheckObjectInside: () => object.objectInsidePaddle(data.paddle[0]) || object.objectInsidePaddle(data.paddle[1]),
                clamp: () => object.clampWithPaddle(),
            },
            {
                checkCollision: () => object.checkWithWallCollision(delta),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithWallCollision(collisionResult.pos, data),
                CheckObjectInside: () => object.objectOutsideCanvas(),
                clamp: () => object.clampWithWall(),
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
                    process.clamp();
                }
                const restAfterCollision = delta - collisionResult.p;
                this.GuaranteeConflict(object, data, restAfterCollision, depth + 1);
                return;
            }
        }
        object.move(delta);
        if (object.objectOutsideCanvas()) {
            object.clampWithWall();
        }
        if (object.objectInsidePaddle(data.paddle[0]) || object.objectInsidePaddle(data.paddle[1])) {
            object.clampWithPaddle();
        }
    }
}

interface CollisionResult {
    p: number;
    pos: any;
}
export default PhysicsEngine;