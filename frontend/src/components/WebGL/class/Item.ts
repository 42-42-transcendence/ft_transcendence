import {CanvasPosition} from "./GameManager";
import {GameObject} from "./GameObject";
import {Paddle, PaddlePos} from "./Paddle";
import data from "../interface/gameData";

export class Item extends GameObject {
    toBeDestroyed: boolean = false;

    private applyItemEffectToPaddle(paddle: Paddle) {
        let rand = Math.random() * 3;
        if (rand < 1) {
            if (paddle.height < 0.8)
                paddle.height += 0.05;
            // console.log("패들 길이 증가!");
        } else if (rand < 2) {
            if (paddle.paddleSpeed < 2.0)
                paddle.paddleSpeed += 0.12;
            // console.log("패들 속도 증가!");
        } else {
            if (paddle.ballVelocityFactor < 3.0)
                paddle.ballVelocityFactor += 0.1;
            // console.log("공 속도 증가!");
        }
    }

    public handleWithPaddleCollision(paddlePos: PaddlePos) {
        if (paddlePos < 3) {
            this.applyItemEffectToPaddle(data.paddle[0]);
        } else {
            this.applyItemEffectToPaddle(data.paddle[1]);
        }
        this.toBeDestroyed = true;
        return true;
    }

    public handleWithWallCollision(side: CanvasPosition) {
        if (side < 2) {
            this.direction[1] *= -1;
        } else {
            this.direction[0] *= -1;
        }
        return false;
    }
}