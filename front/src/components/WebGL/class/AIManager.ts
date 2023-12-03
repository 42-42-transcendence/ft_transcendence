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

    public testPlayer1() {
        const movePaddle = () => {
            const topBoundary = 1.0; // 캔버스의 상단 경계
            const bottomBoundary = -1.0; // 캔버스의 하단 경계

            const paddleY = data.paddle[0].position[1];
            const paddleHeightHalf = data.paddle[0].height / 2;

            let switcher = true;

            if (switcher && paddleY + paddleHeightHalf >= topBoundary - 0.001) {
                data.paddle[0].keyPress.up = false;
                data.paddle[0].keyPress.down = true;
                switcher = false;
            }
            else if (paddleY - paddleHeightHalf <= bottomBoundary + 0.001) {
                data.paddle[0].keyPress.up = true;
                data.paddle[0].keyPress.down = false;
                switcher = true;
            }
        };
        movePaddle();
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
                copy.move(0.000001);
                this.GuaranteeConflict(copy, delta, depth + 1);
                return;
            }
        }

        let collisionResult = copy.checkWithWallCollision(delta);
        if (collisionResult !== undefined) {
            copy.move(collisionResult.p);
            if (collisionResult.pos < 2) {
                copy.direction[1] *= -1;
                copy.move(0.000001);
                this.GuaranteeConflict(copy, delta, depth + 1);
                return;
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
        }
    }
}