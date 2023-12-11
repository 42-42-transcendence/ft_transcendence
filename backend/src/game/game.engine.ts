import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { vec2 } from 'gl-matrix';
import { gamedata, sendGameData } from "./dto/in-game.dto";
import { Ball } from "./dto/Ball";
import { GameModeEnum } from './enums/gameMode.enum';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { Paddle } from './dto/Paddle';
import { GameObject } from './dto/GameObject';
import { ItemManager } from './dto/ItemManager';
import PhysicsEngine from './dto/PhysicsEngine';
import { GameManager } from './dto/GameManager';
import { Game } from './entities/game.entity';



@Injectable()
export class GameEngine {
	constructor(@Inject(forwardRef(() => GameGateway)) private gameGateway : GameGateway,
				@Inject(forwardRef(() => GameService)) private gameService: GameService) {}
    private lastTime: number = 0;
    public delta: number = 0;
    
    async updateGame(delta: number, gameId: string): Promise<void> {
	if (gamedata.mode === 'object') {
		/* 아이템 생성 */
		ItemManager.getInstance().createItem();
		/* 아이템 업데이트 */
		ItemManager.getInstance().updateItems(delta);
	}
	/* 공 위치 업데이트 */
	PhysicsEngine.GuaranteeConflict(gamedata.ball, delta);
	/* 게임 종료 조건 확인 */
	// AIManager.getInstance().GuaranteeConflict(gamedata.ball.clone(), 10000);
	// AIManager.getInstance().testPlayer1(); // 테스트용
	/* player 패들 이동 */
	gamedata.paddle[0].updatePosition(delta);
	gamedata.paddle[1].updatePosition(delta);
    if (GameManager.isChanged){
        this.gameGateway.updateScores(gamedata.scores);
        GameManager.setflag(false);
    }
	if (GameManager.isMatchConcluded()) {
		/* 임시 초기화, 게임 종료 조건 추가 */
		this.gameGateway.gameEnd(gameId);
        GameManager.endGame();
	}
    }
    
    // This method will be called every 20ms
    @Interval(20)
    async startGameLoop(gameId: string): Promise<void> {
        const timeStamp = new Date().getTime();
        this.delta = (timeStamp - this.lastTime) / 1000.0;
    
        await this.updateGame(this.delta, gameId);
        const gameData = this.gameService.getGameData(gameId);
        sendGameData.height[0] = gameData.paddle[0].height;
        sendGameData.height[1] = gameData.paddle[1].height;
        sendGameData.paddlePos[0] = gameData.paddle[0].position;
        sendGameData.paddlePos[1] = gameData.paddle[1].position;
        sendGameData.ballPos = gameData.ball.position;

        this.gameGateway.emitGameData(sendGameData);
    
        this.lastTime = timeStamp;
    }

    getDelta(): number {
        return this.delta;
    }

//     static GuaranteeConflict(object: GameObject, delta: number) {
//         const collisionProcesses = [
//             {
//                 checkCollision: () => object.checkWithPaddleCollision(delta),
//                 handleCollision: (collisionResult: CollisionResult) => object.handleWithPaddleCollision(collisionResult.pos)
//             },
//             {
//                 checkCollision: () => object.checkWithWallCollision(delta),
//                 handleCollision: (collisionResult: CollisionResult) => object.handleWithWallCollision(collisionResult.pos)
//             }
//         ];

//         for (const process of collisionProcesses) {
//             const collisionResult = process.checkCollision();
//             if (collisionResult !== undefined) {
//                 object.move(collisionResult.p);
//                 if (process.handleCollision(collisionResult))
//                     return;
//                 const restAfterCollision = delta - collisionResult.p;
//                 object.move(0.0000001);
//                 this.GuaranteeConflict(object, restAfterCollision);
//                 return;
//             }
//         }
//         object.move(delta);
//     }
}

// interface CollisionResult {
//     p: number;
//     pos: any;
// }