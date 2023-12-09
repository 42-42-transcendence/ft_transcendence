import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";;
import { UserService } from "../user/user.service";
import { InGameDto } from "./dto/in-game.dto";
import { GameInfoDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
// import { GameObjectsDto } from "./dto/game-data.dto";
import { User } from 'src/user/entities/user.entity';
import { GameModeEnum } from './enums/gameMode.enum';
import { GameTypeEnum } from './enums/gameType.enum';
import { GameGateway } from './game.gateway';
import { GameEngine} from './game.engine';
import { GameData } from './enums/gameData';

interface Queue {
    gameId : string;
    isFirst : boolean;
}

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private gameRepository : Repository<Game>,
                private userService : UserService, 
                @Inject(forwardRef(() => GameGateway)) private gameGateway : GameGateway,
                @Inject(forwardRef(() => GameEngine)) private gameEngine : GameEngine) {}

    private playerToGameId = new Map<string, Queue>();
    private gameIdToGameOption = new Map<string, GameOptionDto>();
    gameIdToGameData = new Map<string, GameData>();

    /* ------------------- Game Methods ----------------------- */
    async newGame (clientId : string, gameOptions : GameOptionDto ) : Promise<string> {
        const gameId = clientId;
        if (!gameId)
            return null;
        const user = await this.userService.createUserDummy("player1"); //user 로 대체
        if (!user)
            return null;
        console.log(user.nickname);
        console.log(user.userID);
        const game = await this.gameRepository.save({title: user.nickname+"'s game", player1 : user.nickname, player2 : null, gameType: GameTypeEnum.LADDER});
        this.playerToGameId.set(clientId, {gameId : game.id, isFirst : true});    
        this.gameIdToGameOption.set(game.id, gameOptions);
        const newgamedata : InGameDto = {
            displayName : "player1",
            gameId : game.id,
            player1 : game.player1,
            player2 : "",
        }
        this.gameGateway.server.to(gameId).emit("created", newgamedata);
        return game.id;
    }

    async startGame(clientId1: string, gameOptions: GameOptionDto): Promise<string> {
        const existingQueue = this.findQueueWithoutPlayer2();

        if (!this.isPlayer(clientId1) && !existingQueue) {
            const gameId = await this.newGame(clientId1, gameOptions);
            if (!gameId) {
                console.log("newGame Fail");
                return null;
            }
            return gameId;
        }
    
        let gameId: string;
    
        if (existingQueue) {
            gameId = existingQueue.gameId;
        } else {
            const queue = this.getQueue(clientId1);
            if (queue) {
                gameId = queue.gameId;
            } else {
                console.log("Player not in queue");
                return null;
            }
        }
        const game : Game = await this.findGameById(gameId);
        const ingamedata : InGameDto = {
            displayName : "player2",
            gameId : gameId,
            player1 : game.player1,
            player2 : "asasasas",
        }
        const gameOption = await this.joinGame(clientId1, ingamedata);
        if (!gameOption) {
            console.log("joinGame Fail");
            return null;
        }
        console.log("ready to run engine");
        this.gameEngine.startGameLoop(gameId);

        return (gameId);
    }
      
    findQueueWithoutPlayer2(): Queue | undefined {
        for (const queue of this.playerToGameId.values()) {
            if (queue && !this.getGameOptions(queue.gameId).player2) {
                return queue;
            }
        }
        return undefined;
    }
      
    async joinGame (clientId : string, dto : InGameDto) : Promise<GameOptionDto> {
        const gameOption : GameOptionDto = this.getGameOptions(dto.gameId);
        if (!gameOption || gameOption.isInGame) {
            console.log("non-existent game");
            return null;
        }
        await this.setplayer2(dto.gameId, dto.displayName);
        gameOption.player2 = dto.displayName;
        gameOption.isInGame = true;
        this.gameIdToGameOption.set(dto.gameId, gameOption);
        // this.userService.changeStatus(gameOption.player1, dto.gameId);
        // this.userService.changeStatus(dto.displayName, dto.gameId);
        this.playerToGameId.set(clientId, {gameId : dto.gameId, isFirst : false});
        this.gameGateway.server.to(clientId).emit("joined", dto);

        return gameOption;
    }

    async setplayer2(gameId : string, player2 : string) : Promise<void> {
        const game : Game = await this.findGameById(gameId);
        const user = await this.userService.createUserDummy(player2);
        if (user)
            game.player2 = user.nickname;
        console.log(user.nickname);
        console.log(user.userID);
        await this.gameRepository.save(game);
    }

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

    initGameData(clientid: string, dto: GameData) : void {
        const queue = this.getQueue(clientid);
        if (queue) {
            this.setGameData(queue.gameId, dto)
            this.gameGateway.server.emit('userUpdate');
        }
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
                games.push({player1 : matchData.player1, player2 : matchData.player2, gameId : gameId, player1score: matchData.player1score, player2score: matchData.player2score});
            }
        }
        return games;
    }

    async endOfGame(clientId : string, dto: GameData, gameId : string) : Promise<boolean> {
        if (!this.gameIdToGameOption.has(gameId))
            return false;
        // await this.finalScore(dto, gameId);
        // this.sendScoreToUser(dto, gameId);
        this.deleteGameOption(gameId);
        this.deleteGameData(gameId);
        return true;
    }

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
    //         if (dto.player1score === dto.player2score) {
    //             // this.userService.draw(matchData.player1, gameId);
    //             // this.userService.draw(matchData.player2, gameId);
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