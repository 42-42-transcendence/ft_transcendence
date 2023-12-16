import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from "./game.service";
import { GameDataDto, sendGameDataDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
import { UserStatus } from 'src/user/enums/user-status.enum';;
import { forwardRef, Inject, UseFilters } from '@nestjs/common';;
import { GameEngine } from './game.engine';
import { UserService } from 'src/user/user.service';
import { SocketExceptionFilter } from 'src/events/socket.filter';

@UseFilters(new SocketExceptionFilter())
@WebSocketGateway({
    namespace: 'game',
    cors: {
        origin: 'http://localhost:3000',
    }
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server : Server;

  	constructor(@Inject(forwardRef(() => GameEngine)) private gameEngine : GameEngine,
				@Inject(forwardRef(() => GameService)) private gameService: GameService,
                @Inject(forwardRef(() => UserService)) private userService : UserService,
                ) {}
  afterInit() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const nickname = client.handshake.query.userID;
    const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);
    const userID = user.userID;

    console.log(`GAME GATEWAY ----------- ${user.nickname} ${client.id} connected -------------------`);
    await this.userService.updateUserStatus(user, UserStatus.PLAYING);
    if (this.gameService.isPlayer(userID)) {
        const gameId: string = await this.gameService.getPlayerGameId(userID);
        const gameOptions: GameOptionDto = await this.gameService.getGameOptions(gameId);
        this.server.in(client.id).socketsJoin(gameId);
        console.log(`${user.nickname} joined room ${gameId}`);
        
        if (gameOptions && gameOptions.isActive === false){
            this.gameEngine.startGameLoop(gameId);
            gameOptions.isActive = true;
        }
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const nickname = client.handshake.query.userID;
    const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);

    if (this.gameService.isPlayer(user.userID)){
        const gameId : string = await this.gameService.getPlayerGameId(user.userID);

        if (gameId && this.gameService.isActive(gameId)) {
            const gameData : GameDataDto = this.gameService.getGameData(gameId);
            if (gameData) {
                if (gameData.scores[0] !== 5 && gameData.scores[1] !== 5){
                    console.log("------------------PLAYER ABORTED--------------------")
                    this.gameService.recordAbortLoss(gameId, user.nickname);
                }
                this.gameEnd(gameData, gameId);
            }
        }
        else {
            this.gameService.deletePlayer(user.userID);
            this.gameService.deleteGameOption(gameId);
            this.gameService.deleteGameData(gameId);
        }
        this.server.in(client.id).socketsLeave(gameId);
        console.log(`${user.nickname} left room ${gameId}`);
    }
    await this.userService.updateUserStatus(user, UserStatus.ONLINE);
    console.log(`GAME GATEWAY ----------- ${client.id} disconnected -------------------`);
  }

//   @SubscribeMessage('reconnect') // 재접속 구현 안 할 수도 
//   reconnectGame (@ConnectedSocket() client: Socket) : void {
//       const Pair = this.gameService.getPair(client.id);
//       if (Pair) {
//           const GameDataDto : GameDataDto = this.gameService.getGameDataDto(Pair.gameId);
//           if (GameDataDto) {
//               client.join(Pair.gameId);
//               this.server.to(Pair.gameId).emit("updateGame", GameDataDto);
//           }
//       }
//       else
//           client.emit("notReconnected");
//   }

// 서버에서 일방적으로 요청 (updateGame 핸들러)
  async emitGameData(sendGameDataDto: sendGameDataDto, gameId: string) {
    this.server.to(gameId).emit("updateGame", sendGameDataDto);
  }

  @SubscribeMessage('KeyRelease')
  async onKeyRelease(@ConnectedSocket() client: Socket) : Promise<void> {
    const nickname = client.handshake.query.userID;
    const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);

    const Pair = this.gameService.getPair(user.userID);
    const gameid = await this.gameService.getPlayerGameId(user.userID);
    const gamedata = this.gameService.getGameData(gameid);
    const leftPaddle = gamedata.paddle[0];
    const rightPaddle = gamedata.paddle[1];

    if (Pair) {
        if (Pair.isFirst){
            leftPaddle.keyPress.up = false;
            leftPaddle.keyPress.down = false;
        } else {
            rightPaddle.keyPress.up = false;
            rightPaddle.keyPress.down = false;
        }
    }
}

  @SubscribeMessage('UpKey')
  async UpKeyPressed(@ConnectedSocket() client: Socket) : Promise<void> {
        const nickname = client.handshake.query.userID;
        const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);

        const Pair = this.gameService.getPair(user.userID);
        const gameid = await this.gameService.getPlayerGameId(user.userID);
        const gamedata = this.gameService.getGameData(gameid);
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];

        if (Pair) {
            if (Pair.isFirst){
                leftPaddle.keyPress.up = true;
            } else {
                rightPaddle.keyPress.up = true;
            }
        }
    }

  @SubscribeMessage('DownKey')
  async DownKeyPressed(@ConnectedSocket() client: Socket) : Promise<void> {
        const nickname = client.handshake.query.userID;
        const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);

        const Pair = this.gameService.getPair(user.userID);
        const gameid = await this.gameService.getPlayerGameId(user.userID);
        const gamedata = this.gameService.getGameData(gameid);
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];

        if (Pair) {
            if (Pair.isFirst){
                leftPaddle.keyPress.down = true;
            } else {
                rightPaddle.keyPress.down = true;
            }
        }
    }

  async gameEnd(gamedata: GameDataDto, gameId: string) : Promise<void> {
    const   gameOptions : GameOptionDto = await this.gameService.getGameOptions(gameId);
    const   player1 = gameOptions.player1;
    const   player2 = gameOptions.player2;
    let     winner: string;

    if (gamedata.scores[0] > gamedata.scores[1])
        winner = player1;
    else
        winner = player2;
    if (gameId) {
        this.gameService.deletePlayer(player1);
        this.gameService.deletePlayer(player2);
        const isEnded = await this.gameService.endOfGame(gamedata, gameId);
        if (isEnded) {
            this.server.to(gameId).emit("endGame", winner);
        }
    }
  }
}
