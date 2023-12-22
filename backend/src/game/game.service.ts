import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";;
import { UserService } from "../user/user.service";
import { GameDataDto, GameOptionDto } from "./dto/in-game.dto";
import { GameEngine} from './game.engine';
import { GameGateway } from './game.gateway';
import { Socket } from 'socket.io';

interface Pair {
    gameId : string;
    isLeft : boolean;
}

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private gameRepository : Repository<Game>,
                @Inject(forwardRef(() => UserService)) private userService : UserService,
                @Inject(forwardRef(() => GameGateway)) private gameGateway: GameGateway,
                @Inject(forwardRef(() => GameEngine)) private gameEngine : GameEngine) {}

    private playerToGameId: Map<string, Pair> = new Map();
    private gameIdToGameOption: Map<string, GameOptionDto> = new Map();
    private gameIdToGameData: Map<string, GameDataDto> = new Map();

    private clients: Map<string, Socket> = new Map();

    addClient(userID: string, socket: Socket) {
        this.clients.set(userID, socket);
    }

    removeClient(userID: string) {
        this.clients.delete(userID);
    }

    getClient(userID: string): Socket | undefined  {
        return (this.clients.get(userID));
    }

    hasClient(userID: string): boolean {
        return (this.clients.has(userID));
    }

    /* ------------------- Game Methods ----------------------- */
    async startGame(userNickname1: string, userNickname2: string, gameOptions: GameOptionDto, gameData: GameDataDto): Promise<string> {
        const user = await this.userService.getUserByNickname(userNickname1);
        const user2 = await this.userService.getUserByNickname(userNickname2);
        if (!user || !user2) {
            return null;
        }

        const game = await this.gameRepository.save({title: user.nickname+" vs "+user2.nickname, player1 : userNickname1, player2 : userNickname2, gameType: gameOptions.gametype, gameMode: gameOptions.gamemode});
        this.playerToGameId.set(userNickname1, {gameId : game.gameID, isLeft : true});
        this.playerToGameId.set(userNickname2, {gameId : game.gameID, isLeft : false});
        this.gameIdToGameOption.set(game.gameID, gameOptions);
        this.gameIdToGameData.set(game.gameID, gameData);
        return game.gameID;
    }

    async saveGame(nickname: string): Promise<void> {
        let winner: string = "";

        if (this.isPlayer(nickname)){
            const gameId : string = this.getPlayerGameId(nickname);
            if (gameId && this.isActive(gameId)) {
                const gameData : GameDataDto = this.getGameData(gameId);
    
                this.getGameOptions(gameId).isActive = false;
                if (gameData.intervalId)
                    clearInterval(gameData.intervalId);
                if (gameData.scores[0] !== 10 && gameData.scores[1] !== 10){
                    winner = await this.recordAbortLoss(gameId, nickname);

                    this.gameGateway.emitWinner(winner, gameId);
                    this.deletePlayer(nickname);
                }
            }
            else {
                this.deletePlayer(nickname);
            }
        }
    }

    async cancelGame(userNickname : string, gameId : string) : Promise<void> {
        this.deletePlayer(userNickname);
        this.deleteGameOption(gameId);
        this.deleteGameData(gameId);
        if (this.gameRepository.findOneBy({gameID: gameId}))
            await this.gameRepository.delete(gameId);
    }

    startGameEngine(gameId: string){
        this.gameEngine.startGameLoop(gameId);
    }
    
    isActive(gameId : string) : boolean {
        if (this.gameIdToGameOption.has(gameId))
            return this.gameIdToGameOption.get(gameId).isActive;
        return false;
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
    async findAllGames() : Promise<Game[]> {
        return await this.gameRepository.find();
    }

    async findGameById(gameId : string) : Promise<Game> {
      const game = await this.gameRepository.findOneBy({gameID: gameId});

      if (!game)
        throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${gameId}`);

      return (game);
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
                await this.userService.endGameUser(game.player1, gameId, false);
                await this.userService.endGameUser(game.player2, gameId, true);
            }
            else {
                game.player2Score = 0;
                game.player1Score = 42;
                game.winner = game.player1;
                await this.gameRepository.save(game);
                await this.userService.endGameUser(game.player1, gameId, true);
                await this.userService.endGameUser(game.player2, gameId, false);
            }
        }
        return game.winner;
    }

    deleteGameOption(gameId : string) {
        const result = this.gameIdToGameOption.delete(gameId);
  
        if (result === false)
            return ;
    }

    deletePlayer(userNickname : string) {
        const result = this.playerToGameId.delete(userNickname);
        
        if (result == false)
            return ;
    }

    deleteGameData (gameId : string) {
        const result = this.gameIdToGameData.delete(gameId);

        if (result == false)
            return ;
    }

    isPlayer(userNickname : string) : boolean {
        return this.playerToGameId.has(userNickname);
    }

    getGameData(gameId :string) : GameDataDto {
        return this.gameIdToGameData.get(gameId);
    }

    getPlayerGameId(userNickname : string) : string {
        const gameId = this.playerToGameId.get(userNickname);
        return gameId ? gameId.gameId : null;
    }

    getPair(userNickname : string) : Pair {
        return this.playerToGameId.get(userNickname);
    }

    getGameOptions(gameId : string) : GameOptionDto {
        return this.gameIdToGameOption.get(gameId);
    }
}