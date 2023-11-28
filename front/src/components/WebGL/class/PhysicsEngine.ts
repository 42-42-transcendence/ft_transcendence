import {GameObject} from "./GameObject";

class PhysicsEngine {
    static GuaranteeConflict(object: GameObject, delta: number) {
        const collisionProcesses = [
            {
                checkCollision: () => object.checkWithPaddleCollision(delta),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithPaddleCollision(collisionResult.pos)
            },
            {
                checkCollision: () => object.checkWithWallCollision(delta),
                handleCollision: (collisionResult: CollisionResult) => object.handleWithWallCollision(collisionResult.pos)
            }
        ];

        for (const process of collisionProcesses) {
            const collisionResult = process.checkCollision();
            if (collisionResult !== undefined) {
                object.move(collisionResult.p);
                if (process.handleCollision(collisionResult))
                    return;
                const restAfterCollision = delta - collisionResult.p;
                object.move(0.001);
                this.GuaranteeConflict(object, restAfterCollision);
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
    /* 함수 포인터로 재사용 고려 */
//     static GuaranteeConflict(object: GameObject, delta: number) {
//         const collisionResultInPaddle = object.checkWithPaddleCollision(delta);
//         if (collisionResultInPaddle !== undefined) {
//             object.move(collisionResultInPaddle.p);
//             if (object.handleWithPaddleCollision(collisionResultInPaddle.pos))
//                 return ;
//             const restAfterCollision = delta - collisionResultInPaddle.p;
//             object.move(0.001);
//             this.GuaranteeConflict(object, restAfterCollision);
//             return ;
//         }
//
//         const collisionResultInWall = object.checkWithWallCollision(delta);
//         if (collisionResultInWall !== undefined) {
//             object.move(collisionResultInWall.p);
//             if (object.handleWithWallCollision(collisionResultInWall.pos))
//                 return ;
//             const restAfterCollision = delta - collisionResultInWall.p;
//             object.move(0.001);
//             this.GuaranteeConflict(object, restAfterCollision);
//             return ;
//         }
//
//         object.move(delta);
//     }
// }
export default PhysicsEngine;