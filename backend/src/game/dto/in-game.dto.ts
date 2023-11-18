import { GameTypeEnum } from "../enums/gameType.enum";
import { GameModeEnum } from "../enums/gameMode.enum";

export class GameInfoDto {
    readonly player1 : string;
    readonly player2 : string;
    readonly gameId : string;
}

export class GameOptionDto {
    player1 : string;
    player2 : string;
    paddleHeight : number;
    ballSpeed : number;
    paddleSpeed : number;
    gametype: GameTypeEnum;
    gamemode: GameModeEnum;
    isInGame : boolean;
}

export class GameScoreDto {
    readonly player1Score : number;
    readonly player2Score : number;
}

export class JoinGameDto { // will combine with GameInfoDto
    readonly displayName : string;
    readonly gameId : string;
    readonly player1 : string;
    readonly player2 : string;
}