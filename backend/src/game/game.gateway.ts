import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from "./game.service";
import { GameObjectsDto } from "./dto/game-data.dto";
import { JoinGameDto } from "./dto/in-game.dto";
import { GameOptionDto } from "./dto/in-game.dto";
import { GameData, Paddle, Ball } from "./dto/in-game.dto";
import { GameModeEnum } from './enums/gameMode.enum';
import { forwardRef, Inject } from '@nestjs/common';

const data = new GameData();

@WebSocketGateway({
cors: {
    origin: process.env.FRONT_URL
  }
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server : Server;

  constructor(@Inject(forwardRef(() => GameService)) private readonly gameService: GameService) {}

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
              const GameData : GameObjectsDto = this.gameService.getGameData(gameId);
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
              const GameData : GameObjectsDto = this.gameService.getGameData(gameId);
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
  checkInGame (@ConnectedSocket() client: Socket, @MessageBody() dto : JoinGameDto) : void {
      const queue = this.gameService.getQueue(client.id);
      if (queue) {
          const gameOptions = this.gameService.getGameOptions(queue.gameId);
          if (gameOptions && gameOptions.isInGame)
              client.emit("inGame");
      }
      else {
          const gameId : string = this.gameService.reconnectToGame(client.id, dto.displayName);
          const GameData : GameObjectsDto = this.gameService.getGameData(gameId);
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

  @SubscribeMessage('reconnect') // 재접속 구현 안 할 수도 
  reconnectGame (@ConnectedSocket() client: Socket) : void {
      const queue = this.gameService.getQueue(client.id);
      if (queue) {
          const GameData : GameObjectsDto = this.gameService.getGameData(queue.gameId);
          if (GameData) {
              client.join(queue.gameId);
              this.server.to(queue.gameId).emit("updateGame", GameData);
          }
      }
      else
          client.emit("notReconnected");
  }

  @SubscribeMessage('update')
  async emitGameUpdate(gameId: string, gameData: GameObjectsDto): Promise<void> {
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
  async startGame(@ConnectedSocket() client: Socket, @MessageBody() gameOptions: GameOptionDto): Promise<void> {
  const queue = this.gameService.getQueue(client.id);
  
  if (queue) {
    const gameId = await this.gameService.startGame(client.id, queue.gameId, gameOptions);

    if (gameId) {
      // Notify the clients about the start of the game
      client.join(gameId);
      this.server.to(gameId).emit('gameStarted');
    }
  } else {
    // Handle the case where the player is not in a queue
    client.emit('notInQueue');
  }
}

  @SubscribeMessage('create')
  async createGame (
      @ConnectedSocket() client: Socket, @MessageBody() gameOptions : string) : Promise<void> {
      if (!gameOptions || this.gameService.isPlayer(client.id))
          client.emit('notCreated');
      else {
        // const gameId = await this.gameService.newGame(client.id, gameOptions);
        const gameId = "test";
          if (gameId) {
              client.join(gameId);
              client.emit('created');
            //   this.server.emit('newGame');
          }
          else
              client.emit('notCreated');
      }
      console.log("test game created");
  }

  @SubscribeMessage('join')
  async joinGame (@ConnectedSocket() client: Socket, @MessageBody() dto : JoinGameDto) : Promise<void> {
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
              this.server.to(dto.gameId).emit("started", gameOption);
          }
          else
              client.emit("notStarted");
      }
  }

  @SubscribeMessage('init')
  initialData(@ConnectedSocket() client: Socket, @MessageBody() dto : GameObjectsDto) : void {
      const queue = this.gameService.getQueue(client.id);
      if (queue) {
          this.gameService.setGameData(queue.gameId, dto)
          this.server.emit('userUpdate');
      }
  }

  @SubscribeMessage('KeyRelease')
  onKeyRelease(@ConnectedSocket() client: Socket, @MessageBody() dto : GameObjectsDto) : void {
      const queue = this.gameService.getQueue(client.id);
      if (queue) {
          if (queue.isFirst)
              dto.leftPaddle.delta = 0;
          else
              dto.rightPaddle.delta = 0;
          this.server.to(queue.gameId).emit("updateGame", dto);
          this.gameService.setGameData(queue.gameId, dto);
      }
  }

  @SubscribeMessage('UpKey')
  UpKeyPressed(@ConnectedSocket() client: Socket, @MessageBody() dto : GameObjectsDto) : void {
    const paddle = data.paddle;
    //   const queue = this.gameService.getQueue(client.id);
    //   if (queue) {
    //       if (queue.isFirst)
    //           dto.leftPaddle.delta = -dto.leftPaddle.speed;
    //       else
    //           dto.rightPaddle.delta = -dto.rightPaddle.speed;
    //       this.server.to(queue.gameId).emit("updateGame", dto);
    //       this.gameService.setGameData(queue.gameId, dto);
    //   }
    // paddle[0].position[1] += paddle[0].paddleSpeed * delta;
    console.log("up");
  }

  @SubscribeMessage('DownKey')
  DownKeyPressed(@ConnectedSocket() client: Socket, @MessageBody() dto : GameObjectsDto) : void {
    //   const queue = this.gameService.getQueue(client.id);
    //   if (queue) {
    //       if (queue.isFirst)
    //           dto.leftPaddle.delta = dto.leftPaddle.speed;
    //       else
    //           dto.rightPaddle.delta = dto.rightPaddle.speed;
    //       this.server.to(queue.gameId).emit("updateGame", dto);
    //       this.gameService.setGameData(queue.gameId, dto);
    //   }
    // paddle[0].position[1] -= paddle[0].paddleSpeed * delta;
    console.log("down");
  }

//   @SubscribeMessage('end')
//   async gameEnd(@ConnectedSocket() client: Socket, @MessageBody() dto : GameInfoDto) : Promise<void> {
//       const gameId = this.gameService.getPlayerGameId(client.id);
//       if (gameId) {
//           this.gameService.deletePlayer(client.id);
//           const isEnded = await this.gameService.endOfGame(client.id, dto, gameId);
//           if (isEnded) {
//               this.server.to(gameId).emit('finished');
//           }
//           client.leave(gameId);
//       }
//       this.server.emit('userUpdate');
//   }

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
