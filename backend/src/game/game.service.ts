import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";;
import { UserService } from "../user/user.service";
import { GameDataDto, GameOptionDto } from "./dto/in-game.dto";
import { GameEngine} from './game.engine';

interface Pair {
    gameId : string;
    isLeft : boolean;
}

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private gameRepository : Repository<Game>,
                @Inject(forwardRef(() => UserService)) private userService : UserService,
                @Inject(forwardRef(() => GameEngine)) private gameEngine : GameEngine) {}

    private playerToGameId: Map<string, Pair> = new Map();
    private gameIdToGameOption: Map<string, GameOptionDto> = new Map();
    private gameIdToGameData: Map<string, GameDataDto> = new Map();

    /* ------------------- Game Methods ----------------------- */
    async startGame(userNickname1: string, userNickname2: string, gameOptions: GameOptionDto, gameData: GameDataDto): Promise<string> {
        const user = await this.userService.getUserByNickname(userNickname1);
        const user2 = await this.userService.getUserByNickname(userNickname2);
        if (!user || !user2) {
            console.log("user unavailable to match");
            return null;
        }

        const game = await this.gameRepository.save({title: user.nickname+" vs "+user2.nickname, player1 : userNickname1, player2 : userNickname2, gameType: gameOptions.gametype, gameMode: gameOptions.gamemode});
        this.playerToGameId.set(userNickname1, {gameId : game.gameID, isLeft : true});
        this.playerToGameId.set(userNickname2, {gameId : game.gameID, isLeft : false});
        this.gameIdToGameOption.set(game.gameID, gameOptions);
        this.gameIdToGameData.set(game.gameID, gameData);
        return game.gameID;
    }

    async cancelGame(userNickname : string, gameId : string, option: string) : Promise<void> {
        this.deletePlayer(userNickname);
        this.deleteGameOption(gameId);
        this.deleteGameData(gameId);
        if (option === "cancel"){
            if (this.gameRepository.findOneBy({gameID: gameId}))
                await this.gameRepository.delete(gameId);
        }
    }

    startGameEngine(gameId: string){
        this.gameEngine.startGameLoop(gameId);
    }

    // 재접속 구현 X
    // reconnectToGame (userId : string, playerName : string) : string {
    //     for (const [gameId, GameDataDto] of this.gameIdToGameData) {
    //         if (GameDataDto.players.player1 === playerName) {
    //             this.playerToGameId.set(userId, {gameId: gameId, isLeft: true});
    //             return gameId;
    //         }
    //         else if (GameDataDto.players.player2 === playerName) {
    //             this.playerToGameId.set(userId, {gameId: gameId, isLeft: false});
    //             return gameId;
    //         }
    //     }
    //     return null;
    // }

    getGameData(gameId :string) : GameDataDto {
        return this.gameIdToGameData.get(gameId);
    }

    setGameData(gameId :string, GameDataDto : GameDataDto) {
        this.gameIdToGameData.set(gameId, GameDataDto);
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

    async getActiveGames() : Promise<GameOptionDto[]> {
        const games: GameOptionDto[] = [];
        for (const [gameId, matchData] of this.gameIdToGameOption.entries()) {
            if (matchData.isActive == true) {
                games.push(
                    {player1 : matchData.player1, 
                    player2 : matchData.player2, 
                    gametype: matchData.gametype, 
                    gamemode: matchData.gamemode, 
                    isActive: matchData.isActive});
            }
        }
        return games;
    }

    async endOfGame(dto: GameDataDto, gameId : string) : Promise<boolean> {
        if (!this.gameIdToGameOption.has(gameId))
            return false;
        await this.finalScore(dto, gameId);
        this.deleteGameOption(gameId);
        this.deleteGameData(gameId);
        return true;
    }


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

    async finalScore(dto : GameDataDto, gameId : string): Promise<void> {
        const game : Game = await this.findGameById(gameId);
        if (game) {
            game.finished = true;
            game.player1Score = dto.scores[0];
            game.player2Score = dto.scores[1];            
            if (Number(game.player1Score) > Number(game.player2Score)){
                game.winner = game.player1;
                await this.gameRepository.save(game);
                await this.userService.endGameUser(game.player1, gameId, true);
                await this.userService.endGameUser(game.player2, gameId, false);
            }
            else if (Number(game.player1Score) < Number(game.player2Score)){
                game.winner = game.player2;
                await this.gameRepository.save(game);
                await this.userService.endGameUser(game.player1, gameId, false);
                await this.userService.endGameUser(game.player2, gameId, true);
            }
        }
    }

    async recordAbortLoss (gameId : string, userNickname : string) : Promise <string> {
        const game : Game = await this.findGameById(gameId);
        if (game && game.finished === false) {
            game.finished = true;
            if (userNickname === game.player1) {
                game.player1Score = 0;
                game.player2Score = 42;
                game.winner = game.player2;
                await this.gameRepository.save(game);
                await this.userService.endGameUser(game.player1, gameId, true);
                await this.userService.endGameUser(game.player2, gameId, false);
            }
            else {
                game.player2Score = 0;
                game.player1Score = 42;
                game.winner = game.player1;
                await this.gameRepository.save(game);
                await this.userService.endGameUser(game.player1, gameId, false);
                await this.userService.endGameUser(game.player2, gameId, true);
            }
        }
        return game.winner;
    }

    async deleteGameOption(gameId : string) {
        const result = this.gameIdToGameOption.delete(gameId);
  
        if (result === false)
        //   throw new NotFoundException(`deleteGameOption: 해당 id를 찾을 수 없습니다: ${gameId}`);
            return ;
    }

    async deletePlayer(userNickname : string) {
        const result = this.playerToGameId.delete(userNickname);
        
        if (result == false)
            // throw new NotFoundException(`deletePlayer: 해당 유저 id를 찾을 수 없습니다: ${userId}`);
            return ;
    }

    async deleteGameData (gameId : string) {
        const result = this.gameIdToGameData.delete(gameId);

        if (result == false)
            // throw new NotFoundException(`deleteGameData: 해당 게임 id를 찾을 수 없습니다 ${gameId}`);
            return ;
    }

    isPlayer(userNickname : string) : boolean {
        return this.playerToGameId.has(userNickname);
    }

    async getPlayerGameId(userNickname : string) : Promise<string> {
        const gameId = this.playerToGameId.get(userNickname);
        return gameId ? gameId.gameId : null;
    }

    getPair(userNickname : string) : Pair {
        return this.playerToGameId.get(userNickname);
    }

    async getGameOptions(gameId : string) : Promise<GameOptionDto> {
        return this.gameIdToGameOption.get(gameId);
    }
}