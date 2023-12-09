import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from "./game.service";
// import { GameObjectsDto } from "./dto/game-data.dto";
import { InGameDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
import { GameData } from "./enums/gameData";
import { gamedata, sendGameData} from "./dto/in-game.dto";
import { GameModeEnum } from './enums/gameMode.enum';
import { forwardRef, Inject } from '@nestjs/common';
import { GameTypeEnum } from './enums/gameType.enum';
import { GameEngine } from './game.engine';
import { Ball } from './dto/Ball';
import { vec2 } from 'gl-matrix';


@WebSocketGateway({
cors: {
    origin: process.env.FRONT_URL
  }
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server : Server;

  	constructor(@Inject(forwardRef(() => GameEngine)) private gameEngine : GameEngine,
				@Inject(forwardRef(() => GameService)) private gameService: GameService) {}

  afterInit() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    // for test
    console.log('Client connected');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
      if (this.gameService.isPlayer(client.id)) {
          const gameId : string = this.gameService.getPlayerGameId(client.id);
          if (gameId && this.gameService.isInGame(gameId))
          {
              const GameData : GameData = this.gameService.getGameData(gameId);
              if (GameData)
                  this.server.to(gameId).emit("updateGame", GameData);
          }
          else {
              this.gameService.deleteGameOption(gameId);
              this.gameService.deleteGameData(gameId);
          }
      }
      this.gameService.deletePlayer(client.id);
      console.log('Client Disconnected');
  }

  @SubscribeMessage('playerDisconnected')
  disconnectGame (@ConnectedSocket() client: Socket) : void {
      if (this.gameService.isPlayer(client.id)) {
          const gameId : string = this.gameService.getPlayerGameId(client.id);
          if (gameId && this.gameService.isInGame(gameId))
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
  }

  @SubscribeMessage('checkInGame')
  checkInGame (@ConnectedSocket() client: Socket, @MessageBody() dto : InGameDto) : void {
      const queue = this.gameService.getQueue(client.id);
      if (queue) {
          const gameOptions = this.gameService.getGameOptions(queue.gameId);
          if (gameOptions && gameOptions.isInGame)
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

  @SubscribeMessage('checkCreated')
  checkCreated (@ConnectedSocket() client: Socket) : void {
      const queue = this.gameService.getQueue(client.id);
      if (queue) {
          const gameOptions = this.gameService.getGameOptions(queue.gameId);
          if (gameOptions && !gameOptions.isInGame)
              client.emit("created");
      }
  }

//   @SubscribeMessage('reconnect') // 재접속 구현 안 할 수도 
//   reconnectGame (@ConnectedSocket() client: Socket) : void {
//       const queue = this.gameService.getQueue(client.id);
//       if (queue) {
//           const GameData : GameData = this.gameService.getGameData(queue.gameId);
//           if (GameData) {
//               client.join(queue.gameId);
//               this.server.to(queue.gameId).emit("updateGame", GameData);
//           }
//       }
//       else
//           client.emit("notReconnected");
//   }

  @SubscribeMessage('update')
  async emitGameUpdate(gameId: string, gameData: GameData): Promise<void> {
    const player1 = gameData.players.player1;
    const player2 = gameData.players.player2;

    // Implement the logic to emit updates to the players using WebSockets
    this.server.to(player1).emit("updateGame", gameData);
    this.server.to(player2).emit("updateGame", gameData);
}

  @SubscribeMessage('cancel')
  async cancelGame (@ConnectedSocket() client: Socket) : Promise<void> {
      const queue = this.gameService.getQueue(client.id);
      if (queue) {
          const gameOptions = this.gameService.getGameOptions(queue.gameId);
          if (gameOptions && gameOptions.isInGame === false) {
              client.leave(queue.gameId);
              await this.gameService.cancelGame(client.id, queue.gameId);
          }
      }
  }

  @SubscribeMessage('start')
  async startGame(@ConnectedSocket() client: Socket, @MessageBody() mode: string): Promise<void> {
    const dto : GameOptionDto = {
        player1: client.id,
        player2: "",
        player1score: 0,
        player2score: 0,
        gametype: GameTypeEnum.LADDER,
        gamemode: mode,
        isInGame: false,
    }
    gamedata.ball = new Ball(vec2.fromValues(0, 0), vec2.fromValues(1.0, 0), 2.0, 0.02);
    console.log("client id: ", client.id);
    const gameId = await this.gameService.startGame(client.id, dto);
    if (gameId) {
        client.join(gameId);
        if (this.gameService.isPlayer(client.id))
            this.server.to(gameId).emit('gameStarted', gamedata);
        console.log("game id: ", gameId);
    }
  }

  @SubscribeMessage('create')
  async createGame (
      @ConnectedSocket() client: Socket, @MessageBody() gameOptions : GameOptionDto) : Promise<void> {
      if (!gameOptions || this.gameService.isPlayer(client.id))
          client.emit('notCreated');
      else {
        // const gameId = await this.gameService.newGame(client.id, gameOptions);
        const gameId = "test";
          if (gameId) {
              client.join(gameId);
              client.emit('created');
              this.server.emit('newGame');
          }
          else
              client.emit('notCreated');
      }
      console.log("test game created");
  }

  @SubscribeMessage('join')
  async joinGame (@ConnectedSocket() client: Socket, @MessageBody() dto : InGameDto) : Promise<void> {
      if (!dto)
          client.emit('notStarted');
      else {
          if (this.gameService.isPlayer(client.id)) {
              const queue = this.gameService.getQueue(client.id);
              this.gameService.cancelGame(client.id, queue.gameId);
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
      const queue = this.gameService.getQueue(client.id);
      if (queue) {
          this.gameService.setGameData(queue.gameId, dto)
          this.server.emit('userUpdate');
      }
  }

  emitGameData(gameId: string, gameData: GameData, sendGameData) {
    const player1 = gamedata.players.player1;
    const player2 = gamedata.players.player2;

    // Implement the logic to emit updates to the players using WebSockets
    this.server.to(player1).emit("updateGame", sendGameData);
    this.server.to(player2).emit("updateGame", sendGameData);
  }

  @SubscribeMessage('KeyRelease')
  onKeyRelease(@ConnectedSocket() client: Socket) : void {
    const leftPaddle = gamedata.paddle[0];
    const rightPaddle = gamedata.paddle[1];
    const queue = this.gameService.getQueue(client.id);
    const delta = this.gameEngine.getDelta();

    if (queue) {
        if (queue.isFirst){
            leftPaddle.keyPress.up = false;
            leftPaddle.keyPress.down = false;
            leftPaddle.updatePosition(delta);
        } else{
            rightPaddle.keyPress.up = false;
            rightPaddle.keyPress.down = false;
            rightPaddle.updatePosition(delta);
        }
    }
    this.emitGameData(queue.gameId, gamedata, sendGameData);
}

  @SubscribeMessage('UpKey')
  UpKeyPressed(@ConnectedSocket() client: Socket) : void {
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];
        const queue = this.gameService.getQueue(client.id);
        const delta = this.gameEngine.getDelta();

        if (queue) {
            if (queue.isFirst){
                leftPaddle.keyPress.up = true;
                leftPaddle.updatePosition(delta);
            } else{
                rightPaddle.keyPress.up = true;
                rightPaddle.updatePosition(delta);
            }
        }
        this.emitGameData(queue.gameId, gamedata, sendGameData);
    }

  @SubscribeMessage('DownKey')
  DownKeyPressed(@ConnectedSocket() client: Socket) : void {
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];
        const queue = this.gameService.getQueue(client.id);
        const delta = this.gameEngine.getDelta();

        if (queue) {
            if (queue.isFirst){
                leftPaddle.keyPress.down = true;
                leftPaddle.updatePosition(delta);
            } else{
                rightPaddle.keyPress.down = true;
                rightPaddle.updatePosition(delta);
            }
        }
        this.emitGameData(queue.gameId, gamedata, sendGameData);
    }

  @SubscribeMessage('end')
  async gameEnd(@ConnectedSocket() client: Socket) : Promise<void> {
      const gameId = this.gameService.getPlayerGameId(client.id);
      if (gameId) {
          this.gameService.deletePlayer(client.id);
          const isEnded = await this.gameService.endOfGame(client.id, gamedata, gameId);
          if (isEnded) {
              this.server.to(gameId).emit('endGame');
              this.server.to(gameId).emit('scoreUpdate', gamedata.scores);
          }
          client.leave(gameId);
      }
      this.emitGameData(gameId, gamedata, sendGameData);
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
