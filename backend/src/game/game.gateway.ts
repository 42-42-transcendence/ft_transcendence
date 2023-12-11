import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from "./game.service";
// import { GameObjectsDto } from "./dto/game-data.dto";
import { InGameDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
import { GameData } from "./enums/gameData";
import { gamedata, sendGameData} from "./dto/in-game.dto";
import { GameModeEnum } from './enums/gameMode.enum';
import { UserStatus } from 'src/user/enums/user-status.enum';
import { User } from 'src/user/entities/user.entity';
import { forwardRef, Inject } from '@nestjs/common';
import { GameTypeEnum } from './enums/gameType.enum';
import { GameEngine } from './game.engine';
import { Ball } from './dto/Ball';
import { vec2 } from 'gl-matrix';
import { EventsService } from 'src/events/events.service';
import { UserService } from 'src/user/user.service';
import { isAwaitKeyword } from 'typescript';


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
                private userService: UserService) {}

  afterInit() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    //for test
    const nickname = client.handshake.query.userID;
    const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);

    console.log(`GAME GATEWAY ----------- ${user.nickname} ${client.id} connected -------------------`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
      if (this.gameService.isPlayer(client.id)) {
          const gameId : string = this.gameService.getPlayerGameId(client.id);
          if (gameId && this.gameService.isActive(gameId))
          {
              const GameData : GameData = this.gameService.getGameData(gameId);
              if (GameData) {
                  client.leave(gameId);
                  this.server.to(gameId).emit("updateGame", GameData);
              }
          }
          else {
              this.gameService.deletePlayer(client.id);
              this.gameService.deleteGameOption(gameId);
              this.gameService.deleteGameData(gameId);
          }
      }
      console.log(`GAME GATEWAY ----------- ${client.id} disconnected -------------------`);
  }

//   @SubscribeMessage('playerDisconnected')
//   disconnectGame (@ConnectedSocket() client: Socket) : void {
//       if (this.gameService.isPlayer(client.id)) {
//           const gameId : string = this.gameService.getPlayerGameId(client.id);
//           if (gameId && this.gameService.isActive(gameId))
//           {
//               const GameData : GameData = this.gameService.getGameData(gameId);
//               if (GameData) {
//                   client.leave(gameId);
//                   this.server.to(gameId).emit("updateGame", GameData);
//               }
//           }
//           else {
//               this.gameService.deletePlayer(client.id);
//               this.gameService.deleteGameOption(gameId);
//               this.gameService.deleteGameData(gameId);
//           }
//       }
//   }

  @SubscribeMessage('checkInGame') // NA
  checkInGame (@ConnectedSocket() client: Socket, @MessageBody() dto : InGameDto) : void {
      const Pair = this.gameService.getPair(client.id);
      if (Pair) {
          const gameOptions = this.gameService.getGameOptions(Pair.gameId);
          if (gameOptions && gameOptions.isActive)
              client.emit("inGame");
      }
      else {
          const gameId : string = this.gameService.reconnectToGame(client.id, dto.displayName);
          const GameData : GameData = this.gameService.getGameData(gameId);
          if (gameId) {
              client.join(gameId);
              this.server.to(gameId).emit("updateGame", GameData);
          }
      }
  }

  @SubscribeMessage('checkCreated') // NA
  checkCreated (@ConnectedSocket() client: Socket) : void {
      const Pair = this.gameService.getPair(client.id);
      if (Pair) {
          const gameOptions = this.gameService.getGameOptions(Pair.gameId);
          if (gameOptions && !gameOptions.isActive)
              client.emit("created");
      }
  }

//   @SubscribeMessage('reconnect') // 재접속 구현 안 할 수도 
//   reconnectGame (@ConnectedSocket() client: Socket) : void {
//       const Pair = this.gameService.getPair(client.id);
//       if (Pair) {
//           const GameData : GameData = this.gameService.getGameData(Pair.gameId);
//           if (GameData) {
//               client.join(Pair.gameId);
//               this.server.to(Pair.gameId).emit("updateGame", GameData);
//           }
//       }
//       else
//           client.emit("notReconnected");
//   }

  @SubscribeMessage('update') // 서버에서 일방적으로 요청할 예정 (updateGame 핸들러)
  async emitGameUpdate(gameId: string, gameData: GameData): Promise<void> {
    const player1 = gameData.players.player1;
    const player2 = gameData.players.player2;

    // Implement the logic to emit updates to the players using WebSockets
    this.server.to(player1).emit("updateGame", gameData);
    this.server.to(player2).emit("updateGame", gameData);
}

  @SubscribeMessage('cancel')
  async cancelGame (@ConnectedSocket() client: Socket) : Promise<void> {
      const Pair = this.gameService.getPair(client.id);
      if (Pair) {
          const gameOptions = this.gameService.getGameOptions(Pair.gameId);
          if (gameOptions && gameOptions.isActive === false) {
              client.leave(Pair.gameId);
              await this.gameService.cancelGame(client.id, Pair.gameId);
          }
      }
  }


  @SubscribeMessage('join')
  async joinGame (@ConnectedSocket() client: Socket, @MessageBody() dto : InGameDto) : Promise<void> {
      if (!dto)
          client.emit('notStarted');
      else {
          if (this.gameService.isPlayer(client.id)) {
              const Pair = this.gameService.getPair(client.id);
              this.gameService.cancelGame(client.id, Pair.gameId);
          }
          const gameOption : GameOptionDto = await this.gameService.joinGame(client.id, dto);
          if (gameOption) {
            client.join(dto.gameId);
            // this.server.to(dto.gameId).emit("started", gameOption);
            client.emit('joined');
          }
          else
              client.emit("notStarted");
      }
  }

  @SubscribeMessage('init')
  initialData(@ConnectedSocket() client: Socket, @MessageBody() dto : GameData) : void {
      const Pair = this.gameService.getPair(client.id);
      if (Pair) {
          this.gameService.setGameData(Pair.gameId, dto)
          this.server.emit('userUpdate');
      }
  }

  emitGameData(sendGameData: any) {
    const player1 = gamedata.players.player1;
    const player2 = gamedata.players.player2;

    this.server.to(player1).emit("updateGame", sendGameData);
    this.server.to(player2).emit("updateGame", sendGameData);
  }

  updateScores(data: Number[]) {
    const player1 = gamedata.players.player1;
    const player2 = gamedata.players.player2;

    this.server.to(player1).emit("scoreUpdate", data);
    this.server.to(player2).emit("scoreUpdate", data);
  }

  @SubscribeMessage('KeyRelease')
  onKeyRelease(@ConnectedSocket() client: Socket) : void {
    const leftPaddle = gamedata.paddle[0];
    const rightPaddle = gamedata.paddle[1];
    const Pair = this.gameService.getPair(client.id);
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
    this.emitGameData(sendGameData);
}

  @SubscribeMessage('UpKey')
  UpKeyPressed(@ConnectedSocket() client: Socket) : void {
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];
        const Pair = this.gameService.getPair(client.id);
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
        this.emitGameData(sendGameData);
    }

  @SubscribeMessage('DownKey')
  DownKeyPressed(@ConnectedSocket() client: Socket) : void {
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];
        const Pair = this.gameService.getPair(client.id);
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
        this.emitGameData(sendGameData);
    }

  async gameEnd(gameId: string) : Promise<void> {
    const player1 = gamedata.players.player1;
    const player2 = gamedata.players.player2;

      if (gameId) {
          this.gameService.deletePlayer(player1);
          this.gameService.deletePlayer(player2);
          const isEnded = await this.gameService.endOfGame(gamedata, gameId);
          if (isEnded) {
              this.server.to(player1).emit('endGame');
              this.server.to(player2).emit('scoreUpdate', gamedata.scores);
          }
        //   client.leave(gameId);
      }
      this.emitGameData(sendGameData);
  }

//   @SubscribeMessage('exit')
//   leaveGame(@ConnectedSocket() client: Socket, @MessageBody() player : string) : void {
//       const gameId = this.gameService.getPlayerGameId(client.id);
//       if (gameId) {
//           this.gameService.deletePlayer(client.id);
//           this.server.to(gameId).emit('left', player);
//           this.gameService.leaveGame(client.id, player, gameId);
//           client.leave(gameId);
//       }
//       this.server.emit('userUpdate');
//   }
}
