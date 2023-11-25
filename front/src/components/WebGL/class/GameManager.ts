import data from "../interface/gameData";
import {Item} from "./Item";
import {vec2} from "gl-matrix";
import PhysicsEngine from "./PhysicsEngine";

export enum CanvasPosition {
    TopRight,
    BottomRight,
    TopLeft,
    BottomLeft
}

export class GameManager {
    static lastItemCreationTime: number = Date.now();
    static scoreUpdate(player: string) {
        const idx = player === 'player1' ? 0 : 1;
        ++data.scores[idx];
        data.scoreRef[idx]!.innerText = String(data.scores[idx]);
        this.resetBallPosition();
    }

    static createItem() {
        const currentTime = Date.now();
        if (currentTime - this.lastItemCreationTime >= 1000 && data.items.length < 5) {
            const newItem = this.createRandomItem();
            data.items.push(newItem);
            this.lastItemCreationTime = currentTime;
        }
    }

    static checkOverLine(ballPos: vec2) : string {
        const radius = data.ball.radius;

        if (ballPos[0] + radius > 1.0 || ballPos[0] - radius < -1.0) {
            console.log("점수 획득"); // 디버깅
            PhysicsEngine._paddlePos = null;
            return ballPos[0] + radius > 1.0 ? 'player1' : 'player2';
        }
        return '';
    }

    static createRandomItem() {
        let randomX = Math.random();
        if (randomX < 0.5) {
            randomX = randomX * 0.6 - 0.5;
        } else {
            randomX = randomX * 0.6 + 0.2;
        }
        let randomY = Math.random() - 0.5;
        const direction = vec2.normalize(vec2.create(), vec2.fromValues(randomX, randomY));

        return new Item(direction);
    }

    static resetBallPosition() {
        const ball = data.ball;
        for (let i = 0; i < 2; i++)
            ball.position[i] = 0;
        ball.direction = vec2.fromValues(1.0, 0);
    }

    static resetGame() {
        const ball = data.ball;
        for (let i = 0; i < 2; i++) {
            ball.position[i] = 0;
            data.scores[i] = 0;
            data.scoreRef[i]!.innerText = String(data.scores[i]);
        }
        ball.direction = vec2.fromValues(1.0, 0);
    }
    static isMatchConcluded() {
        return data.scores[0] === 5 || data.scores[1] === 5
    }
}
