import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";;
import { UserService } from "../user/user.service";
import { GameDataDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
import { GameEngine} from './game.engine';
import { UserStatus } from 'src/user/enums/user-status.enum';

interface Pair {
    gameId : string;
    isFirst : boolean;
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
    async startGame(userId1: string, userId2: string, gameOptions: GameOptionDto, gameData: GameDataDto): Promise<string> {
        const user = await this.userService.getUserById(userId1);
        const user2 = await this.userService.getUserById(userId2);
        if (!user || !user2) {
            console.log("user unavailable to match");
            return null;
        }
        
        // 올바른 유저 정보 확인용
        console.log("--------------------");
        console.log(user.nickname);
        console.log(user.userID);
        console.log(user2.nickname);
        console.log(user2.userID);
        console.log("--------------------");
        //

        const game = await this.gameRepository.save({title: user.nickname+" vs "+user2.nickname, player1 : user.userID, player2 : user2.userID, gameType: gameOptions.gametype, gameMode: gameOptions.gamemode});
        this.playerToGameId.set(userId1, {gameId : game.gameID, isFirst : true});
        this.playerToGameId.set(userId2, {gameId : game.gameID, isFirst : false});
        this.gameIdToGameOption.set(game.gameID, gameOptions);
        this.gameIdToGameData.set(game.gameID, gameData);
        return game.gameID;
    }

    async cancelGame(userId : string, gameId : string, option: string) : Promise<void> {
        this.deletePlayer(userId);
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
    //             this.playerToGameId.set(userId, {gameId: gameId, isFirst: true});
    //             return gameId;
    //         }
    //         else if (GameDataDto.players.player2 === playerName) {
    //             this.playerToGameId.set(userId, {gameId: gameId, isFirst: false});
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
                    player1score: matchData.player1score, 
                    player2score: matchData.player2score, 
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
            game.player1Score = dto.scores[0];
            game.player2Score = dto.scores[1];
            game.finished = true;
            if (Number(game.player1Score) > Number(game.player2Score)){
                game.winner = game.player1;
                await this.gameRepository.save(game);
                console.log(`----------gameId: ${gameId} ---------------`);
                this.userService.endGameUser((await this.userService.getUserById(game.player1)), gameId, true);
                this.userService.endGameUser((await this.userService.getUserById(game.player2)), gameId, false);
            }
            else if (Number(game.player1Score) < Number(game.player2Score)){
                game.winner = game.player2;
                await this.gameRepository.save(game);
                console.log(`----------gameId: ${gameId} ---------------`);
                this.userService.endGameUser((await this.userService.getUserById(game.player1)), gameId, false);
                this.userService.endGameUser((await this.userService.getUserById(game.player2)), gameId, true);
            }
            this.deleteGameData(gameId);
        }
    }

    async recordAbortLoss (gameId : string, userId : string) : Promise <boolean> {
        const game : Game = await this.findGameById(gameId);
        if (game && game.finished === false) {
            game.finished = true;
            if (game.player1 === userId) {
                game.player2Score = 42;
                game.winner = game.player2;
                await this.gameRepository.save(game);
                this.userService.endGameUser((await this.userService.getUserById(game.player1)), gameId, false);
                this.userService.endGameUser((await this.userService.getUserById(game.player2)), gameId, true);
            }
            else {
                game.player1Score = 42;
                game.winner = game.player1;
                await this.gameRepository.save(game);
                this.userService.endGameUser((await this.userService.getUserById(game.player1)), gameId, true);
                this.userService.endGameUser((await this.userService.getUserById(game.player2)), gameId, false);
            }
            return true;
        }
        return false;
    }

    async deleteGameOption(gameId : string) {
        const result = this.gameIdToGameOption.delete(gameId);
  
        if (result === false)
        //   throw new NotFoundException(`deleteGameOption: 해당 id를 찾을 수 없습니다: ${gameId}`);
            return ;
    }

    async deletePlayer(userId : string) {
        const result = this.playerToGameId.delete(userId);
        
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

    isPlayer(userId : string) : boolean {
        return this.playerToGameId.has(userId);
    }

    async getPlayerGameId(userId : string) : Promise<string> {
        const gameId = this.playerToGameId.get(userId);
        return gameId ? gameId.gameId : null;
    }

    getPair(userId : string) : Pair {
        return this.playerToGameId.get(userId);
    }

    async getGameOptions(gameId : string) : Promise<GameOptionDto> {
        return this.gameIdToGameOption.get(gameId);
    }
}