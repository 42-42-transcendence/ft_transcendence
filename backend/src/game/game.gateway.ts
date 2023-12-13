import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from "./game.service";
import { GameDataDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
import { UserStatus } from 'src/user/enums/user-status.enum';;
import { forwardRef, Inject, UseFilters } from '@nestjs/common';;
import { GameEngine } from './game.engine';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
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
                private authService: AuthService,
                @Inject(forwardRef(() => UserService)) private userService : UserService,
                ) {}
  afterInit() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const nickname = client.handshake.query.userID;
    const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);
    const userID = user.userID;

    console.log(`GAME GATEWAY ----------- ${user.nickname} ${client.id} connected -------------------`);
    if (this.gameService.isPlayer(userID)) {
        const gameId: string = await this.gameService.getPlayerGameId(userID);
        this.server.in(client.id).socketsLeave(gameId);
        console.log(`${user.nickname} joined room ${gameId}`);//
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
        const nickname = client.handshake.query.userID;
        const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);

        if (this.gameService.isPlayer(user.userID)) {
          const gameId : string = await this.gameService.getPlayerGameId(client.id);
          if (gameId && this.gameService.isActive(gameId))
          {
              const gameData : GameDataDto = this.gameService.getGameData(gameId);
              if (gameData) {
                  if (gameData.scores[0] !== 5 || gameData.scores[1] !== 5)
                    this.gameService.recordAbortLoss(gameId, user.userID);
                this.gameService.cancelGame(user.userID, gameId, "abort");
              }
          }
          else {
              this.gameService.deletePlayer(client.id);
              this.gameService.deleteGameOption(gameId);
              this.gameService.deleteGameData(gameId);
          }
          this.server.in(client.id).socketsLeave(gameId);
      }
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
  async emitGameData(sendGameDataDto: any, gameId: string) {
    const game : GameOptionDto = await this.gameService.getGameOptions(gameId);
    const player1 = game.player1;
    const player2 = game.player2;

    this.server.to(player1).emit("updateGame", sendGameDataDto);
    this.server.to(player2).emit("updateGame", sendGameDataDto);
  }

//   async updateScores(data: Number[]) {
//     const game : GameOptionDto = await this.gameService.getGameOptions(gameId);
//     const player1 = game.player1;
//     const player2 = game.player2;

//     this.server.to(player1).emit("scoreUpdate", data);
//     this.server.to(player2).emit("scoreUpdate", data);
//   }

  @SubscribeMessage('KeyRelease')
  onKeyRelease(@ConnectedSocket() client: Socket) : void {
    const Pair = this.gameService.getPair(client.id);
    const gamedata = this.gameService.getGameData(Pair.gameId);
    const leftPaddle = gamedata.paddle[0];
    const rightPaddle = gamedata.paddle[1];
    const delta = this.gameEngine.getDelta();

    if (Pair) {
        if (Pair.isFirst){
            leftPaddle.keyPress.up = false;
            leftPaddle.keyPress.down = false;
            leftPaddle.updatePosition(delta);
        } else{
            rightPaddle.keyPress.up = false;
            rightPaddle.keyPress.down = false;
            rightPaddle.updatePosition(delta);
        }
    }
}

  @SubscribeMessage('UpKey')
  UpKeyPressed(@ConnectedSocket() client: Socket) : void {
        const Pair = this.gameService.getPair(client.id);
        const gamedata = this.gameService.getGameData(Pair.gameId);
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];
        const delta = this.gameEngine.getDelta();

        if (Pair) {
            if (Pair.isFirst){
                leftPaddle.keyPress.up = true;
                leftPaddle.updatePosition(delta);
            } else{
                rightPaddle.keyPress.up = true;
                rightPaddle.updatePosition(delta);
            }
        }
    }

  @SubscribeMessage('DownKey')
  DownKeyPressed(@ConnectedSocket() client: Socket) : void {
        const Pair = this.gameService.getPair(client.id);
        const gamedata = this.gameService.getGameData(Pair.gameId);
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];
        const delta = this.gameEngine.getDelta();

        if (Pair) {
            if (Pair.isFirst){
                leftPaddle.keyPress.down = true;
                leftPaddle.updatePosition(delta);
            } else{
                rightPaddle.keyPress.down = true;
                rightPaddle.updatePosition(delta);
            }
        }
    }

  async gameEnd(gamedata: GameDataDto, gameId: string) : Promise<void> {
    const game : GameOptionDto = await this.gameService.getGameOptions(gameId);
    const player1 = game.player1;
    const player2 = game.player2;

    if (gameId) {
        this.gameService.deletePlayer(player1);
        this.gameService.deletePlayer(player2);
        const isEnded = await this.gameService.endOfGame(gamedata, gameId);
        if (isEnded) {
            this.server.to(player1).emit('endGame');
            this.server.to(player2).emit('endGame');
            await this.userService.updateUserStatus(await this.userService.getUserById(player1), UserStatus.ONLINE);
            await this.userService.updateUserStatus(await this.userService.getUserById(player2), UserStatus.ONLINE);
        }
    }
  }
}
