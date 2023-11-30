import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { vec2 } from "gl-matrix";
import { Game } from "./entities/game.entity";;
import { UserService } from "../user/user.service";
import { GameData, Paddle, Ball, InGameDto } from "./dto/in-game.dto";
import { GameInfoDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
// import { GameObjectsDto } from "./dto/game-data.dto";
import { User } from 'src/user/entities/user.entity';
import { GameModeEnum } from './enums/gameMode.enum';
import { GameTypeEnum } from './enums/gameType.enum';
import { StringMappingType } from 'typescript';
import { GameGateway } from './game.gateway';
import { GameEngine} from './game.engine';

interface Queue {
    gameId : string;
    isFirst : boolean;
}

const data = new GameData();

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private gameRepository : Repository<Game>,
                private userService : UserService, 
                @Inject(forwardRef(() => GameGateway)) private gameGateway : GameGateway,
                private gameEngine: GameEngine) {}

    private playerToGameId = new Map<string, Queue>();
    private gameIdToGameOption = new Map<string, GameOptionDto>();
    gameIdToGameData = new Map<string, GameData>();

    /* ------------------- Game Methods ----------------------- */
    async newGame (clientId : string, gameOptions : GameOptionDto ) : Promise<string> {
        const gameId = clientId;
        if (gameId)
            return null;
        const user = await this.userService.createUserDummy(); //user 로 대체
        if (!user)
            return null;
        console.log(user.nickname);
        console.log(user.userID);
        const game = await this.gameRepository.save({player1 : user.userID, player2 : null});
        this.playerToGameId.set(clientId, {gameId : game.id, isFirst : true});    
        this.gameIdToGameOption.set(game.id, gameOptions);
        this.gameGateway.server.to(gameId).emit("created");
        return game.id;
    }

    async startGame(clientId1: string, clientId2: string, gameOptions: GameOptionDto): Promise<string> {
        let gameId = null;
        if (!this.playerToGameId.has(clientId1)){
            gameId = await this.newGame(clientId1, gameOptions);
            if (!gameId) {
                return null;
            }
        }
        else{
            const ingamedata : InGameDto = {
                displayName : "player2",
                gameId : "test",
                player1 : "player",
                player2 : "player2",
            }
            const gameOption = await this.joinGame(clientId2, ingamedata);
        
            if (!gameOption) {
            return null;
            }
        }
        this.gameEngine.startGameLoop(gameId);

        return (gameId);
    }
      
    // private async startGameLoop(gameId: string): Promise<void> {
    //     setInterval(async () => {
    //       await this.updateGame(gameId);
    //       const gameData = this.getGameData(gameId);
    //       this.gameGateway.server.to(gameId).emit("updateGame", gameData);
    //     }, 20);
    // }
      
    async joinGame (clientId : string, dto : InGameDto) : Promise<GameOptionDto> {
        const gameOption : GameOptionDto = this.getGameOptions(dto.gameId);
        if (!gameOption || gameOption.isInGame) {
            return null;
        }
        await this.setplayer2(dto.gameId, dto.displayName);
        gameOption.player2.player2 = dto.displayName;
        gameOption.isInGame = true;
        this.gameIdToGameOption.set(dto.gameId, gameOption);
        // this.userService.changeStatus(gameOption.player1, dto.gameId);
        // this.userService.changeStatus(dto.displayName, dto.gameId);
        this.playerToGameId.set(clientId, {gameId : dto.gameId, isFirst : false});
        this.gameGateway.server.to(dto.gameId).emit("joined");

        // const queue = this.getQueue(clientId);
        // const player1 = this.playerToGameId.get(queue.gameId);
      
        // if (player1 && player1.isFirst) {
            
        //     const gameOptions = this.getGameOptions(queue.gameId);
        //     const gameId = await this.startGame(clientId, player1.gameId, gameOptions);
        
        //     if (gameId) {
        //       this.gameGateway.server.to(gameId).emit('gameStarted');
        //     }
        return gameOption;
    }

    // private async updateGame(gameId: string): Promise<void> {
    //     const gamedata = this.gameIdToGameData.get(gameId);

    //     const checkBallPaddleCollision = (ballPos: vec2, paddle: Paddle) =>{
    //         const radius = data.ball.radius;
    //         const paddleHeightHalf = paddle.height / 2.0;
    //         const paddleWidthHalf = paddle.width / 2.0;
    //         let paddleTop = paddle.position[1] + paddleHeightHalf;
    //         let paddleBottom = paddle.position[1] - paddleHeightHalf;
    //         let paddleLeft = paddle.position[0] - paddleWidthHalf;
    //         let paddleRight = paddle.position[0] + paddleWidthHalf;
    
    //         const BallTop = ballPos[1] + radius;
    //         const BallBottom = ballPos[1] - radius;
    //         const BallLeft = ballPos[0] - radius;
    //         const BallRight = ballPos[0] + radius;
    
    //         return (BallTop > paddleBottom && BallBottom < paddleTop && BallLeft < paddleRight && BallRight > paddleLeft);
    //     };
        
    //     const handleBallPaddleCollision = () =>{
    //         const ball = data.ball;
    //         const paddle = data.paddle;
    
    //         for (let i = 0; i < 2; i++) {
    //             if (checkBallPaddleCollision(ball.position, paddle[i])) {
    //                 let normalReflect = vec2.fromValues(i == 0 ? 1 : -1, 0); // 왼쪽 패들이면 1, 오른쪽 패들이면 -1
    //                 normalReflect[1] = (ball.position[1] - paddle[i].position[1]) / paddle[i].height * 3.0;
    //                 // if (i === 0 && BallLeft < paddle[i].position[0] || i === 1 && BallRight > paddle[i].position[0])
    //                 //     normalReflect[0] *= -1;
    //                 vec2.normalize(ball.direction, normalReflect);
    //             }
    //         }
    //     }
    
    //     const handleBallWallCollision = () => {
    //         const ball = data.ball;
    //         if (ball.position[1] + ball.radius > 1.0 || ball.position[1] - ball.radius < -1.0) {
    //             ball.direction[1] *= -1; // 위, 아래 벽에 닿을 경우 공의 반사를 구현 (정반사)
    //         }
    //     }
    
    //     const collisionGuarantee = (ball: Ball, delta: number) => {
    //         for (let i = 0; i < 2; i++) {
    //             const dir = i === 0 ? 1 : -1;
    //             const x1 = ball.position[0];
    //             const y1 = ball.position[1];
    //             const x2 = data.paddle[i].position[0];
    //             const y2 = data.paddle[i].position[1];
    //             const wh = data.paddle[i].width / 2.0;
    //             const hh = data.paddle[i].height / 2.0;
    //             const dx = ball.direction[0] * ball.velocity;
    //             const dy= ball.direction[1] * ball.velocity;
    
    //             const t = (x2 - x1 + (wh * dir) - hh) / dx;
    //             const k = y2 - y1 - dy * t;
    
    //             /* 충돌이 없다면 */
    //             if ((k < 0 || k > hh * 2) && t > delta) {
    //                 updateBallPosition(delta);
    //                 return;
    //             }
    //             /* 충돌이 있다면 */
    //             updateBallPosition(t);
    //             const restAfterCollision = delta - t;
    //             handleBallPaddleCollision();
    //             updateBallPosition(restAfterCollision);
    //         }
    //     }

    //     const calculateBallPosition = (ball: Ball, delta: number) : vec2 => {
    //         let tempVec2 = vec2.create();
    //         vec2.add(tempVec2, ball.position, vec2.scale(tempVec2, ball.direction, ball.velocity * delta));
    //         return tempVec2;
    //     }
    
    //     const updateBallPosition = (delta: number) => {
    //         data.ball.position = calculateBallPosition(data.ball, delta);
    //     }
    
    //     const updatePaddlePosition = (delta: number) => {
    //         const paddle = data.paddle;
    //         /* 현재 player1의 패들 위치만 고려 */
    //         if (data.keyPress.up) {
    //             paddle[0].position[1] += paddle[0].paddleSpeed * delta;
    //         } else if (data.keyPress.down) {
    //             paddle[0].position[1] -= paddle[0].paddleSpeed * delta;
    //         } else {
    //             paddle[0].position[1] += 0;
    //         }
    
    //         /* 패들 위치 제한 */
    //         if (paddle[0].position[1] - paddle[0].height / 2.0 < -1.0) {
    //             paddle[0].position[1] = -1.0 + paddle[0].height / 2.0;
    //         }
    //         if (paddle[0].position[1] + paddle[0].height / 2.0 > 1.0)
    //             paddle[0].position[1] = 1.0 - paddle[0].height / 2.0;
    //     }
        
    //     this.gameGateway.emitGameUpdate(gameId, gamedata);
    // }

    reconnectToGame (clientId : string, playerName : string) : string {
        for (const [gameId, GameData] of this.gameIdToGameData) {
            if (GameData.players.player1 === playerName) {
                this.playerToGameId.set(clientId, {gameId: gameId, isFirst: true});
                return gameId;
            }
            else if (GameData.players.player2 === playerName) {
                this.playerToGameId.set(clientId, {gameId: gameId, isFirst: false});
                return gameId;
            }
        }
        return null;
    }

    getGameData (gameId :string) : GameData {
        return this.gameIdToGameData.get(gameId);
    }

    setGameData (gameId :string, GameData : GameData) {
        this.gameIdToGameData.set(gameId, GameData);
    }

    deleteGameData (gameId : string) {
        this.gameIdToGameData.delete(gameId);
    }
    
    async setplayer2(gameId : string, player2 : string) : Promise<void> {
        const game : Game = await this.findGameById(gameId);
        const user = await this.userService.createUserDummy();
        if (user)
            game.player2 = user.userID;
        console.log(user.nickname);
        console.log(user.userID);
        await this.gameRepository.save(game);
    }

    isInGame(gameId : string) : boolean {
        if (this.gameIdToGameOption.has(gameId))
            return this.gameIdToGameOption.get(gameId).isInGame;
        return false;
    }

    async getFinishedGames() : Promise<Game[] | null> {
        const games : Game[] = [];
        const allGames = await this.gameRepository.find();
        allGames.forEach((game) => {
            if (game.finished)
                games.push(game);
        })
        return games;
    }

    getGamesToJoin() : GameInfoDto[] {
        const games: GameInfoDto[] = [];
        for (const [gameId, matchData] of this.gameIdToGameOption.entries()) {
            if (!matchData.isInGame) {
                games.push({player1 : matchData.player1.player1, player2 : matchData.player2.player2, gameId : gameId, player1score: matchData.player1.player1Score, player2score: matchData.player2.player2Score});
            }
        }
        return games;
    }

    // async endOfGame(clientId : string, dto : GameInfoDto, gameId : string) : Promise<boolean> {
    //     if (!this.gameIdToGameOption.has(gameId))
    //         return false;
    //     await this.finalScore(dto, gameId);
    //     this.sendScoreToUser(dto, gameId);
    //     this.deleteGameOption(gameId);
    //     this.deleteGameData(gameId);
    //     return true;
    // }

    // async leaveGame (clientId : string, playerName : string, gameId : string) : Promise<void> {
    //     await this.recordTechnicalLoose(gameId, playerName);
    //     this.deleteGameOption(gameId);
    //     this.deleteGameData(gameId);
    // }


    /* ------------------- DB, Match History ----------------------- */
    async findAllGame() : Promise<Game[]> {
        return await this.gameRepository.find();
    }

    async findGameById(gameId : string) : Promise<Game> {
      const game = await this.gameRepository.findOneBy({id: gameId});

      if (!game)
        throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${gameId}`);

      return (game);
    }

    async finalScore(dto : GameInfoDto, gameId : string) {
        const game : Game = await this.findGameById(gameId);
        if (game) {
            game.player1Score = dto.player1score;
            game.player2Score = dto.player2score;
            // this.userService.changeStatus(game.player1, "online");
            // this.userService.changeStatus(game.player2, "online");
            game.finished = true;
            if (Number(game.player1Score) > Number(game.player2Score))
                game.winner = game.player1;
            else if (Number(game.player1Score) < Number(game.player2Score))
                game.winner = game.player2;
            await this.gameRepository.save(game);
        }
    }


    async deleteGameOption(gameId : string) : Promise<void> {
      const result = this.gameIdToGameOption.delete(gameId);

      if (result === false)
        throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${gameId}`);
    }

    // async recordTechnicalLoose (gameId : string, playerName : string) : Promise <boolean> {
    //     const game : Game = await this.findGameById(gameId);
    //     if (game && game.finished === false) {
    //         const matchData = this.gameIdToGameOption.get(gameId);
    //         this.userService.changeStatus(game.player1, "online");
    //         this.userService.changeStatus(game.player2, "online");
    //         game.finished = true;
    //         if (game.player1 === playerName) {
    //             game.player2Score = 11; // 패배 조건 추후 수정
    //             game.winner = game.player2;
    //             this.userService.loseGame(matchData.player1, gameId);
    //             this.userService.winGame(matchData.player2, gameId);
    //         }
    //         else {
    //             game.player1Score = 11;
    //             game.winner = game.player1; // 패배 조건 추후 수정
    //             this.userService.loseGame(matchData.player2, gameId);
    //             this.userService.winGame(matchData.player1, gameId);
    //         }
    //         await this.gameRepository.save(game);
    //         return true;
    //     }
    //     return false;
    // }

    deletePlayer(clientId : string) : void {
        this.playerToGameId.delete(clientId);
    }

    isPlayer(clientId : string) : boolean {
        return this.playerToGameId.has(clientId);
    }

    getPlayerGameId(clientId : string) : string {
        const gameId = this.playerToGameId.get(clientId);
        return gameId ? gameId.gameId : null;
    }

    getQueue(clientId : string) : Queue {
        return this.playerToGameId.get(clientId);
        
    }

    getGameOptions(gameId : string) : GameOptionDto {
        return this.gameIdToGameOption.get(gameId);
    }

    // sendScoreToUser(dto : GameInfoDto, gameId : string) : void {
    //     const matchData = this.gameIdToGameOption.get(gameId);
    //     if (matchData) {
    //         if (dto.player1Score === dto.player2Score) {
    //             this.userService.draw(matchData.player1, gameId);
    //             this.userService.draw(matchData.player2, gameId);
    //         }
    //         else if (Number(dto.player1Score) < Number(dto.player2Score)) {
    //             this.userService.loseGame(matchData.player1, gameId);
    //             this.userService.winGame(matchData.player2, gameId);
    //         }
    //         else {
    //             this.userService.winGame(matchData.player1, gameId);
    //             this.userService.loseGame(matchData.player2, gameId);
    //         }
    //         this.deleteGameData(gameId);
    //     }
    // }

    async cancelGame(clientId : string, gameId : string) : Promise<void> {
        this.deleteGameOption(gameId);
        this.deletePlayer(clientId);
        await this.gameRepository.delete(gameId);
    }
}