import data from "../interface/gameData";
import {Ball} from "./Ball";
import {CanvasPosition} from "./GameManager";

export class AIManager {
    private static instance: AIManager;
    static getInstance() {
        if (!AIManager.instance)
            AIManager.instance = new AIManager();
        return AIManager.instance;
    }

    public GuaranteeConflict(copy: Ball, delta: number, depth: number = 0) {
        if (depth > 10) {
            data.paddle[1].keyPress.up = false;
            data.paddle[1].keyPress.down = false;
            return;
        }
        {
            let collisionResult = copy.checkWithPaddleCollision(delta);
            if (collisionResult !== undefined) {
                copy.move(collisionResult.p);
                if (collisionResult.pos >= 3) {
                    data.paddle[1].keyPress.down = false;
                    data.paddle[1].keyPress.up = false;
                    return;
                }
                copy.handleWithPaddleCollision(collisionResult.pos);
                copy.move(0.001);
                this.GuaranteeConflict(copy, delta, depth + 1);
                return;
            }
        }

        let collisionResult = copy.checkWithWallCollision(delta);
        if (collisionResult !== undefined) {
            copy.move(collisionResult.p);
            if (collisionResult.pos < 2) {
                copy.direction[1] *= -1;
                copy.move(0.001);
                this.GuaranteeConflict(copy, delta, depth + 1);
                return;
            }

            if (collisionResult.pos === CanvasPosition.BottomRight) {
                if (copy.position[1] < data.paddle[1].position[1]) {
                    data.paddle[1].keyPress.up = false;
                    data.paddle[1].keyPress.down = true;
                }
                else {
                    data.paddle[1].keyPress.down = false;
                    data.paddle[1].keyPress.up = true;
                }
            }
        }
    }
}