import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { vec2 } from 'gl-matrix';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { ItemManager } from './dto/ItemManager';
import PhysicsEngine from './dto/PhysicsEngine';
import { GameDataDto, sendGameDataDto } from "./dto/in-game.dto";

let sendData: sendGameDataDto = {
	paddlePos: [[0, 0], [0, 0]],
	height: [0, 0],
	ballPos: [0, 0],
    // itemsPos: [vec2.fromValues(0, 0), vec2.fromValues(0, 0)],
    scores: [0, 0],
}

@Injectable()
export class GameEngine {
	constructor(@Inject(forwardRef(() => GameGateway)) private gameGateway : GameGateway,
				@Inject(forwardRef(() => GameService)) private gameService: GameService) {}

    async updateGame(delta: number, gamedata: GameDataDto): Promise<void> {
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
        console.log(gamedata.ball.position[0]);
        console.log(gamedata.ball.position[1]);
        console.log(gamedata.paddle[0].position);
        console.log(gamedata.paddle[1].position);
    }
    
    updateSendData(gameData: GameDataDto){
        sendData.height[0] = gameData.paddle[0].height;
        sendData.height[1] = gameData.paddle[1].height;
        sendData.paddlePos[0][0] = gameData.paddle[0].position[0];
        sendData.paddlePos[0][1] = gameData.paddle[0].position[1];
        sendData.paddlePos[1][0] = gameData.paddle[1].position[0];
        sendData.paddlePos[1][1] = gameData.paddle[1].position[1];
        sendData.ballPos[0] = gameData.ball.position[0];
        sendData.ballPos[1] = gameData.ball.position[1];
        sendData.scores = gameData.scores;
        // sendData.Itempos
        return sendData;
    }
    

    async startGameLoop(gameId: string): Promise<void> {
        const interval = setInterval(async () => { 
            const gameData = this.gameService.getGameData(gameId);
            if (!gameData)
                return ;
            if (gameData.lastTime === 0)
                gameData.lastTime = new Date().getTime();
            if (gameData.scores[0] === 5 || gameData.scores[1] === 5){
                console.log("game end to max score");
                (await this.gameService.getGameOptions(gameId)).isActive = false;
                const sendData = this.updateSendData(gameData);
                this.gameGateway.emitGameData(sendData, gameId);
                await this.gameGateway.gameEnd(gameData, gameId);
                clearInterval(interval);
                return ;
            }
            const timeStamp = new Date().getTime();
            let delta = (timeStamp - gameData.lastTime) / 1000.0;
            // if (timeStamp < gameData.lastTime + (1000 / 60)){
            //     return ;
            // }
            await this.updateGame(delta, gameData);
            const sendData = this.updateSendData(gameData);
            this.gameGateway.emitGameData(sendData, gameId);
            
            gameData.lastTime = timeStamp;
        }, 1000 / 60);
    }
}