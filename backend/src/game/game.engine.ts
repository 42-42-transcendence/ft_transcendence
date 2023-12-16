import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { vec2 } from 'gl-matrix';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { ItemManager } from './dto/ItemManager';
import PhysicsEngine from './dto/PhysicsEngine';
import { GameDataDto, sendGameDataDto } from "./dto/in-game.dto";

let sendData: sendGameDataDto = {
	paddlePos: [vec2.fromValues(0, 0), vec2.fromValues(0, 0)],
	height: [0, 0],
	ballPos: vec2.fromValues(0, 0),
    scores: [0, 0],
}

@Injectable()
export class GameEngine {
	constructor(@Inject(forwardRef(() => GameGateway)) private gameGateway : GameGateway,
				@Inject(forwardRef(() => GameService)) private gameService: GameService) {}
    private lastTime: number = 0;
    public delta: number = 0;
    
    async updateGame(delta: number, gameId: string): Promise<void> {
        let gamedata = this.gameService.getGameData(gameId);
        if (gamedata.mode === 'object') {
		/* 아이템 생성 */
		ItemManager.getInstance().createItem();
		/* 아이템 업데이트 */
		ItemManager.getInstance().updateItems(delta, gamedata.paddle, gamedata);
	    }
        /* 공 위치 업데이트 */
        PhysicsEngine.GuaranteeConflict(gamedata.ball, gamedata.paddle, gamedata, delta);

        /* player 패들 이동 */
        gamedata.paddle[0].updatePosition(delta);
        gamedata.paddle[1].updatePosition(delta);
    }
    
    updateSendData(gameData: GameDataDto){
        sendData.height[0] = gameData.paddle[0].height;
        sendData.height[1] = gameData.paddle[1].height;
        sendData.paddlePos[0] = gameData.paddle[0].position;
        sendData.paddlePos[1] = gameData.paddle[1].position;
        sendData.ballPos = gameData.ball.position;
        sendData.scores = gameData.scores;
    }

    // This loop will be called every 20ms
    @Interval(20)
    async startGameLoop(gameId: string): Promise<void> {
        const gameData = this.gameService.getGameData(gameId);
        if (gameData.scores[0] == 5 || gameData.scores[1] == 5){
            (await this.gameService.getGameOptions(gameId)).isActive = false;
            const sendData = this.updateSendData(gameData);
            this.gameGateway.emitGameData(sendData, gameId);
            await this.gameGateway.gameEnd(gameData, gameId);
            return ;
        }
        const timeStamp = new Date().getTime();
        gameData.delta = (timeStamp - this.lastTime) / 1000.0;

        await this.updateGame(gameData.delta, gameId);
        const sendData = this.updateSendData(gameData);
        this.gameGateway.emitGameData(sendData, gameId);
    
        this.lastTime = timeStamp;
    }

    getDelta(): number {
        return this.delta;
    }
}