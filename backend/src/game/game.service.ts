import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game } from "./entities/game.entity";;
import { UserService } from "../user/user.service";
import { GameInfoDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
import { GameDataDto } from "./dto/game-data.dto";
import { User } from 'src/user/entities/user.entity';

interface Queue {
    gameId : string;
    isFirst : boolean;
}

@Injectable()
export class GameService {
    constructor(@InjectRepository(Game) private gameRepository : Repository<Game>,
                private userService : UserService) {}

    private playerToGameId = new Map<string, Queue>();
    private gameIdToGameOption = new Map<string, GameOptionDto>();
    private gameIdToGameData = new Map<string, GameDataDto>();

    async newGame (clientId : string, dto : GameOptionDto ) : Promise<string> {
        const gameId = this.getPlayerGameId(clientId);
        if (gameId)
            return null;
        const user = new User;
        if (!user)
            return null;
        const game = await this.gameRepository.save({player1 : user.id, player2 : null});
        this.playerToGameId.set(clientId, {gameId : game.id, isFirst : true});
        this.gameIdToGameOption.set(game.id, dto);
        return game.id;
    }

    reconnectToGame (clientId : string, playerName : string) : string {
        for (const [gameId, gameData] of this.gameIdToGameData) {
            if (gameData.players.player1 === playerName) {
                this.playerToGameId.set(clientId, {gameId: gameId, isFirst: true});
                return gameId;
            }
            else if (gameData.players.player2 === playerName) {
                this.playerToGameId.set(clientId, {gameId: gameId, isFirst: false});
                return gameId;
            }
        }
        return null;

    }

    getGameData (gameId :string) : GameDataDto {
        return this.gameIdToGameData.get(gameId);
    }

    setGameData (gameId :string, gameData : GameDataDto) {
        this.gameIdToGameData.set(gameId, gameData);
    }

    deleteGameData (gameId : string) {
        this.gameIdToGameData.delete(gameId);
    }

    // async joinGame (clientId : string, dto : JoinGameDto) : Promise<GameOptionDto> {
    //     const gameOption : GameOptionDto = this.getGameOptions(dto.gameId);
    //     if (!gameOption || gameOption.isInGame) {
    //         return null;
    //     }
    //     await this.setplayer2(dto.gameId, dto.displayName);
    //     gameOption.player2 = dto.displayName;
    //     gameOption.isInGame = true;
    //     this.gameIdToGameOption.set(dto.gameId, gameOption);
    //     this.userService.changeStatus(gameOption.player1, dto.gameId);
    //     this.userService.changeStatus(dto.displayName, dto.gameId);
    //     this.playerToGameId.set(clientId, {gameId : dto.gameId, isFirst : false});
    //     return gameOption;
    // }

    // async setplayer2(gameId : string, player2 : string) : Promise<void> {
    //     const game : Game = await this.findGameById(gameId);
    //     const user = await this.userService.findByID(player2);
    //     if (user)
    //         game.player2 = user.id;
    //     await this.gameRepository.save(game);
    // }

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
                games.push({player1 : matchData.player1, player2 : matchData.player2, gameId : gameId});
            }
        }
        return games;
    }

    // async endOfGame(clientId : string, dto : GameScoreDto, gameId : string) : Promise<boolean> {
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

    // DB
    async findAllGame() : Promise<Game[]> {
        return await this.gameRepository.find();
    }

    async findGameById(gameId : string) : Promise<Game> {
      const game = await this.gameRepository.findOneBy({id: gameId});

      if (!game)
        throw new NotFoundException(`해당 id를 찾을 수 없습니다: ${gameId}`);

      return (game);
    }

    // async finalScore(dto : GameScoreDto, gameId : string) {
    //     const game : Game = await this.findGameById(gameId);
    //     if (game) {
    //         game.player1Score = dto.player1Score;
    //         game.player2Score = dto.player2Score;
    //         this.userService.changeStatus(game.player1, "online");
    //         this.userService.changeStatus(game.player2, "online");
    //         game.finished = true;
    //         if (Number(game.player1Score) > Number(game.player2Score))
    //             game.winner = game.player1;
    //         else if (Number(game.player1Score) < Number(game.player2Score))
    //             game.winner = game.player2;
    //         await this.gameRepository.save(game);
    //     }
    // }


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

    // sendScoreToUser(dto : GameScoreDto, gameId : string) : void {
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