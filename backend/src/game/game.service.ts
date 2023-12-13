import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";;
import { UserService } from "../user/user.service";
import { GameInfoDto, InGameDto } from "./dto/in-game.dto";
// import { GameInfoDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
// import { GameObjectsDto } from "./dto/game-data.dto";
import { User } from 'src/user/entities/user.entity';
import { GameModeEnum } from './enums/gameMode.enum';
import { GameTypeEnum } from './enums/gameType.enum';
import { GameGateway } from './game.gateway';
import { GameEngine} from './game.engine';
import { GameData } from './enums/gameData';
import { UserStatus } from 'src/user/enums/user-status.enum';
import { EventsService } from 'src/events/events.service';
import { dot } from 'node:test/reporters';
import { glMatrix } from 'gl-matrix';

interface Pair {
    gameId : string;
    isFirst : boolean;
}

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private gameRepository : Repository<Game>,
                @Inject(forwardRef(() => UserService)) private userService : UserService,
                @Inject(forwardRef(() => GameGateway)) private gameGateway : GameGateway,
                @Inject(forwardRef(() => GameEngine)) private gameEngine : GameEngine) {}

    private playerToGameId = new Map<string, Pair>();
    private gameIdToGameOption = new Map<string, GameOptionDto>();
    gameIdToGameData = new Map<string, GameData>();

    /* ------------------- Game Methods ----------------------- */
    async newGame (userId1 : string, gameOptions : GameOptionDto ) : Promise<string> {
        const user = await this.userService.getUserById(userId1);
        if (!user) {
            console.log("user1 unavailable")
            return null;
        }
        // 올바른 유저 정보 확인
        console.log(user.nickname);
        console.log(user.userID);
        //
        const game = await this.gameRepository.save({title: user.nickname+"'s game", player1 : user.userID, player2 : null, gameType: gameOptions.gametype, gameMode: gameOptions.gamemode});
        this.playerToGameId.set(userId1, {gameId : game.gameID, isFirst : true});    
        this.gameIdToGameOption.set(game.gameID, gameOptions);
        return game.gameID;
    }

          
    async joinGame (userId2 : string, dto : InGameDto) : Promise<GameOptionDto> {
        const gameOption : GameOptionDto = this.getGameOptions(dto.gameId);
        if (!gameOption || gameOption.isActive) {
            console.log("attempting to join non-existent game");
            return null;
        }
        await this.setplayer2(dto.gameId, gameOption.player2);
        gameOption.isActive = true;
        this.gameIdToGameOption.set(dto.gameId, gameOption);
        this.playerToGameId.set(userId2, {gameId : dto.gameId, isFirst : false});
        return gameOption;
    }

    async setplayer2(gameId : string, player2 : string) : Promise<void> {
        const game : Game = await this.findGameById(gameId);
        const user = await this.userService.getUserById(player2);
        if (!user) {
            console.log("user2 unavailable")
            return null;
        }
        game.player2 = user.userID;
        // user2 참가 확인
        console.log(user.nickname);
        console.log(user.userID);
        //
        await this.gameRepository.save(game);
    }

    // async startGame(clientId1: string, gameOptions: GameOptionDto): Promise<string> {
    //     const existingPair = this.findPairWithoutPlayer2();

    //     if (!this.isPlayer(clientId1) && !existingPair) {
    //         const gameId = await this.newGame(clientId1, gameOptions);
    //         if (!gameId) {
    //             console.log("newGame Fail");
    //             return null;
    //         }
    //         return gameId;
    //     }
    
    //     let gameId: string;
    
    //     if (existingPair) {
    //         gameId = existingPair.gameId;
    //     } else {
    //         const Pair = this.getPair(clientId1);
    //         if (Pair) {
    //             gameId = Pair.gameId;
    //         } else {
    //             console.log("Player not in Pair");
    //             return null;
    //         }
    //     }
    //     const game : Game = await this.findGameById(gameId);
    //     const ingamedata : InGameDto = {
    //         displayName : "player2",
    //         gameId : gameId,
    //         player1 : game.player1,
    //         player2 : "asasasas",
    //     }
    //     const gameOption = await this.joinGame(clientId1, ingamedata);
    //     if (!gameOption) {
    //         console.log("joinGame Fail");
    //         return null;
    //     }
    //     console.log("ready to run engine");
    //     this.startGameEngine(gameId);

    //     return (gameId);
    // }
      
    startGameEngine(gameId: string){
        this.gameEngine.startGameLoop(gameId);
    }

    // findPairWithoutPlayer2(): Pair | undefined {
    //     for (const Pair of this.playerToGameId.values()) {
    //         if (Pair && !this.getGameOptions(Pair.gameId).player2) {
    //             return Pair;
    //         }
    //     }
    //     return undefined;
    // }

    // 재접속 구현 X
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
        const Pair = this.getPair(clientid);
        if (Pair) {
            this.setGameData(Pair.gameId, dto)
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
    
    isActive(gameId : string) : boolean {
        if (this.gameIdToGameOption.has(gameId))
            return this.gameIdToGameOption.get(gameId).isActive;
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

    // getGamesToJoin() : GameInfoDto[] {
    //     const games: GameInfoDto[] = [];
    //     for (const [gameId, matchData] of this.gameIdToGameOption.entries()) {
    //         if (!matchData.isActive) {
    //             games.push({player1 : matchData.player1, player2 : matchData.player2, gameId : gameId, player1score: matchData.player1score, player2score: matchData.player2score});
    //         }
    //     }
    //     return games;
    // }

    async endOfGame(dto: GameData, gameId : string) : Promise<boolean> {
        if (!this.gameIdToGameOption.has(gameId))
            return false;
        await this.finalScore(dto, gameId);
        this.sendScoreToUser(dto, gameId);
        this.deleteGameOption(gameId);
        this.deleteGameData(gameId);
        return true;
    }

    // async leaveGame (clientId : string, playerName : string, gameId : string) : Promise<void> {
    //     await this.recordTechnicalLoss(gameId, playerName);
    //     this.deleteGameOption(gameId);
    //     this.deleteGameData(gameId);
    // }


    /* ------------------- DB, Match History ----------------------- */
    async findAllGame() : Promise<Game[]> {
        return await this.gameRepository.find();
    }

    async findGameById(gameId : string) : Promise<Game> {
      const game = await this.gameRepository.findOneBy({gameID: gameId});

      if (!game)
        throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${gameId}`);

      return (game);
    }

    async finalScore(dto : GameData, gameId : string) {
        const game : Game = await this.findGameById(gameId);
        if (game) {
            game.player1Score = dto.scores[0];
            game.player2Score = dto.scores[1];
            this.userService.updateUserStatus((await this.userService.getUserById(game.player1)), UserStatus.ONLINE);
            this.userService.updateUserStatus((await this.userService.getUserById(game.player2)), UserStatus.ONLINE);
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

    async recordTechnicalLoss (gameId : string, playerName : string) : Promise <boolean> {
        const game : Game = await this.findGameById(gameId);
        if (game && game.finished === false) {
            const matchData = this.gameIdToGameOption.get(gameId);
            this.userService.updateUserStatus((await this.userService.getUserById(game.player1)), UserStatus.ONLINE);
            this.userService.updateUserStatus((await this.userService.getUserById(game.player2)), UserStatus.ONLINE);
            game.finished = true;
            if (game.player1 === playerName) {
                game.player2Score = 11; // 패배 조건 추후 수정
                game.winner = game.player2;
                // this.userService.loseGame(matchData.player1, gameId);
                // this.userService.winGame(matchData.player2, gameId);
            }
            else {
                game.player1Score = 11;
                game.winner = game.player1; // 패배 조건 추후 수정
                // this.userService.loseGame(matchData.player2, gameId);
                // this.userService.winGame(matchData.player1, gameId);
            }
            await this.gameRepository.save(game);
            return true;
        }
        return false;
    }

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

    getPair(clientId : string) : Pair {
        return this.playerToGameId.get(clientId);
    }

    getGameOptions(gameId : string) : GameOptionDto {
        return this.gameIdToGameOption.get(gameId);
    }

    sendScoreToUser(dto : GameData, gameId : string) : void {
        const matchData = this.gameIdToGameOption.get(gameId);
        if (matchData) {
            if (Number(dto.scores[0]) < Number(dto.scores[1])) {
                // this.userService.loseGame(matchData.player1, gameId);
                // this.userService.winGame(matchData.player2, gameId);
            }
            else {
                // this.userService.winGame(matchData.player1, gameId);
                // this.userService.loseGame(matchData.player2, gameId);
            }
            this.deleteGameData(gameId);
        }
    }

    // async wonGame(displayname : string, matchId : string) : Promise<void> {
    //     const user = await this.userRepository.findOneBy({displayName: displayname});
    //     if (user) {
    //         user.matchHistory.push(matchId);
    //         user.wins += 1;
    //         user.score += 3;
    //         if (user.status != "offline")
    //             user.status = "online";
    //         await this.userRepository.save(user);
    //     }
    // }

    // async lostGame(displayname : string, matchId : string) : Promise<void> {
    //     const user = await this.userRepository.findOneBy({displayName: displayname});
    //     if (user) {
    //         user.matchHistory.push(matchId);
    //         user.losses += 1;
    //         if (user.status != "offline")
    //             user.status = "online";
    //         await this.userRepository.save(user);
    //     }
    // }

    async cancelGame(userId : string, gameId : string) : Promise<void> {
        this.deletePlayer(userId);
        this.deleteGameOption(gameId);
        this.deleteGameData(gameId);
        await this.gameRepository.delete(gameId);
    }
}