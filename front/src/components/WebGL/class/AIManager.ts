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

    private AICheckWithPaddleCollision(copy: Ball, delta: number) {
        let collisionResult = copy.checkWithPaddleCollision(delta);
        if (collisionResult !== undefined) {
            copy.move(collisionResult.p);
            if (collisionResult.pos < 3) {
                copy.handleWithPaddleCollision(collisionResult.pos);
                copy.move(0.000001);
                return true;
            }
            data.paddle[1].keyPress.down = false;
            data.paddle[1].keyPress.up = false;
        }
        return false;
    }

    private AICheckWithWallCollision(copy: Ball, delta: number) {
        let collisionResult = copy.checkWithWallCollision(delta);
        if (collisionResult !== undefined) {
            copy.move(collisionResult.p);
            if (collisionResult.pos < 2) {
                copy.direction[1] *= -1;
                copy.move(0.000001);
                return true;
            }

            if (collisionResult.pos === CanvasPosition.Right) {
                if (copy.position[1] < data.paddle[1].position[1]) {
                    data.paddle[1].keyPress.up = false;
                    data.paddle[1].keyPress.down = true;
                }
                else {
                    data.paddle[1].keyPress.down = false;
                    data.paddle[1].keyPress.up = true;
                }
            }
            else {
                data.paddle[1].keyPress.up = false;
                data.paddle[1].keyPress.down = false;   
            }
        }
        return false;
    }

    public GuaranteeConflict(copy: Ball, delta: number, depth: number = 0) {
        if (depth > 10) {
            data.paddle[1].keyPress.up = false;
            data.paddle[1].keyPress.down = false;
            return;
        }

        if (this.AICheckWithPaddleCollision(copy, delta) || this.AICheckWithWallCollision(copy, delta))
            this.GuaranteeConflict(copy, delta, depth + 1);
    }
}