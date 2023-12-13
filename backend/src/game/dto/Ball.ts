import {vec2} from "gl-matrix";
import { PaddlePos } from "../enums/gameEnums";
import { GameObject } from "./GameObject";
import { CanvasPosition } from "../enums/gameEnums";
import { GameManager } from "./GameManager";
import { GameDataDto } from "./in-game.dto";

export class Ball extends GameObject{
    public handleWithWallCollision(side: CanvasPosition, gamedata: GameDataDto) {
        if (side < 2) {
            this.direction[1] *= -1;
            return false;
        }
        if (side === CanvasPosition.Right)
            GameManager.scoreUpdate(0, gamedata);
        else
            GameManager.scoreUpdate(1, gamedata);
        return true;
    }
    public handleWithPaddleCollision(paddlePos: PaddlePos, gamedata: GameDataDto) {
        let paddle, normalReflect;
        if (paddlePos < 3) {
            paddle = gamedata.paddle[0];
            normalReflect = vec2.fromValues(1, 0);
            this.factor = paddle.ballVelocityFactor;
        } else {
            paddle = gamedata.paddle[1];
            normalReflect = vec2.fromValues(-1, 0);
            this.factor = paddle.ballVelocityFactor;
        }
        normalReflect[1] = (this.position[1] - paddle.position[1]) / paddle.height * 4.0;
        vec2.normalize(this.direction, normalReflect);
        return false;
    }

    clone() {
        let copy = new Ball(this.position, this.direction, this.velocity, this.radius);
        copy.position = vec2.clone(this.position);
        copy.direction = vec2.clone(this.direction);
        copy.factor = this.factor;
        copy.radius = this.radius;
        return copy;
    }
}