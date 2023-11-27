import data from "../interface/gameData";
import {PaddlePos} from "./Paddle";

class PhysicsEngine {
    static _paddlePos : PaddlePos | null = null;

    static checkItemCollision(delta: number) {
        let items = data.items;
        let collisionResult : {p : number, q : number} | undefined = undefined;

        const paddles = data.paddle;
        for (let i = items.length - 1; i >= 0; i--) {
            let collisionDetected = false;
            const item = items[i];

            if (item.checkWithPaddleCollision(i, delta)) {
                collisionDetected = true;
                break;
            }

            if (!collisionDetected) {
                data.items[i].checkMoved(delta);
            }
        }
        return collisionResult;
    }

    static GuaranteeConflict(delta: number) {
        const p = data.ball.calCheckConflict(delta);

        if (p === undefined) {
            data.ball.updateBallPosition(delta, this._paddlePos);
            return ;
        }
        data.ball.updateBallPosition(p.p, this._paddlePos);
        data.ball.handleBallPaddleCollision();
        const restAfterCollision = delta - p.p;
        this._paddlePos = p.pos;
        this.GuaranteeConflict(restAfterCollision);
    }
}
export default PhysicsEngine;