import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { ItemManager } from './classes/ItemManager';
import { GameDataDto, sendGameDataDto } from "./dto/in-game.dto";
import PhysicsEngine from './classes/PhysicsEngine';

@Injectable()
export class GameEngine {
	constructor(@Inject(forwardRef(() => GameGateway)) private gameGateway : GameGateway,
				@Inject(forwardRef(() => GameService)) private gameService: GameService) {}

    updateGame(delta: number, gamedata: GameDataDto) {
        if (gamedata.mode === 'object') {
		    /* 아이템 생성 */
		    ItemManager.getInstance().createItem(gamedata.items);
		    /* 아이템 업데이트 */
		    ItemManager.getInstance().updateItems(delta, gamedata);
	    }
        /* 공 위치 업데이트 */
        PhysicsEngine.GuaranteeConflict(gamedata.ball, gamedata, delta);

        /* player 패들 이동 */
        gamedata.paddle[0].updatePosition(delta);
        gamedata.paddle[1].updatePosition(delta);
    }
    
    updateSendData(sendData: sendGameDataDto, gameData: GameDataDto){
        sendData.height[0] = gameData.paddle[0].height;
        sendData.height[1] = gameData.paddle[1].height;
        sendData.paddlePos[0][0] = gameData.paddle[0].position[0];
        sendData.paddlePos[0][1] = gameData.paddle[0].position[1];
        sendData.paddlePos[1][0] = gameData.paddle[1].position[0];
        sendData.paddlePos[1][1] = gameData.paddle[1].position[1];
        sendData.ballPos[0] = gameData.ball.position[0];
        sendData.ballPos[1] = gameData.ball.position[1];
        sendData.scores = gameData.scores;
        for (let i = 0; i < gameData.items.length; i++){
            sendData.itemsPos[i] = [gameData.items[i].position[0], gameData.items[i].position[1]];
        }
    }

    async startGameLoop(gameId: string): Promise<void> {
        const interval = setInterval(async () => { 
            const gameData = this.gameService.getGameData(gameId);

            if (!gameData){
                clearInterval(interval);
                return ;
            }
            if (!gameData.intervalId)
                gameData.intervalId = interval;

            if (gameData.lastTime === 0)
                gameData.lastTime = new Date().getTime();

            const sendData: sendGameDataDto = {
                paddlePos: [[0, 0], [0, 0]],
                height: [0, 0],
                ballPos: [0, 0],
                itemsPos: [],
                scores: [0, 0],
            }
            if (gameData.scores[0] === 10 || gameData.scores[1] === 10){
                clearInterval(interval);
                this.gameService.getGameOptions(gameId).isActive = false;
                this.updateSendData(sendData, gameData);
                this.gameGateway.emitGameData(sendData, gameId);
                await this.gameGateway.gameEnd(gameData, gameId);                
                return ;
            }
            const timeStamp = new Date().getTime();
            let delta = (timeStamp - gameData.lastTime) / 1000.0;
            this.updateGame(delta, gameData);
            this.updateSendData(sendData, gameData);
            this.gameGateway.emitGameData(sendData, gameId);
            
            gameData.lastTime = timeStamp;
        }, 1000 / 200);
    }
}