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

            if (item.handleWithPaddleCollision(i, delta)) {
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
        const p = data.ball.predictCollision(delta);

        if (p === undefined) {
            data.ball.move(delta, this._paddlePos);
            return ;
        }
        data.ball.move(p.p, this._paddlePos);
        data.ball.handleWithPaddleCollision();
        const restAfterCollision = delta - p.p;
        this._paddlePos = p.pos;
        this.GuaranteeConflict(restAfterCollision);
    }
}
export default PhysicsEngine;