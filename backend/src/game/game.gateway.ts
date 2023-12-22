import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from "./game.service";
import { GameDataDto, sendGameDataDto, GameOptionDto } from "./dto/in-game.dto";
import { UserStatus } from 'src/user/enums/user-status.enum';;
import { forwardRef, Inject, UseFilters } from '@nestjs/common';;
import { UserService } from 'src/user/user.service';
import { SocketExceptionFilter } from 'src/events/socket.filter';
import { SocketException } from 'src/events/socket.exception';
import { EventsService } from 'src/events/events.service';

@UseFilters(new SocketExceptionFilter())
@WebSocketGateway({
    namespace: 'game',
    cors: {
        origin: `http://${process.env.HOST_DOMAIN}:${process.env.HOST_PORT}`,
    }
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server : Server;

  	constructor(@Inject(forwardRef(() => GameService)) private gameService: GameService,
                @Inject(forwardRef(() => UserService)) private userService: UserService,
                @Inject(forwardRef(() => EventsService)) private eventsService: EventsService,
                ) {}

  afterInit() {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const nickname = client.handshake.query.userID;
    if (typeof nickname !== 'string') {
        throw new SocketException('BadRequest', `query를 잘못 입력하셨습니다.`);
    }

    const waitUser = await this.userService.getUserByNicknameWithWsException(nickname);
    const waitForClient = async () => {
        await new Promise((resolve) => {
            const timerID = setInterval(() => {
                if (this.eventsService.hasClient(waitUser.userID)) {
                    clearInterval(timerID);
                    resolve(null);
                }
            }, 50);
        });
    };
    await waitForClient();

    const user = await this.userService.getUserByNicknameWithWsException(<string>nickname);
    console.log(`[GAME GATEWAY] ----------- ${user.nickname} ${client.id} connected -------------------`);
    if (this.gameService.isPlayer(nickname)) {
        this.server.to(client.id).emit("isValid", true);

        const gameId: string = this.gameService.getPlayerGameId(nickname);
        if (gameId){
            const gameOptions: GameOptionDto = this.gameService.getGameOptions(gameId);
            gameOptions.isActive = true;
        }
        this.server.in(client.id).socketsJoin(gameId);
        await this.userService.updateUserStatus(user, UserStatus.PLAYING);
    }
    else
        this.server.to(client.id).emit("isValid", false);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const nickname = client.handshake.query.userID;
    if (typeof nickname !== 'string') {
        throw new SocketException('BadRequest', `query를 잘못 입력하셨습니다.`);
    }

    const gameId = this.gameService.getPlayerGameId(nickname);
    if (gameId){
        this.server.in(client.id).socketsLeave(gameId);
    }

    await this.gameService.saveGame(nickname);
    this.gameService.deleteGameOption(gameId);
    this.gameService.deleteGameData(gameId);

    const updatedUser = await this.userService.getUserByNicknameWithWsException(<string>nickname);
    if (updatedUser.status !== UserStatus.ONLINE) {
        await this.userService.updateUserStatus(updatedUser, UserStatus.ONLINE);
    }
    console.log(`[GAME GATEWAY] ----------- ${updatedUser.nickname} ${client.id} disconnected -------------------`);
  }

  emitGameData(sendGameDataDto: sendGameDataDto, gameId: string) {
    this.server.to(gameId).emit("updateGame", sendGameDataDto);
  }

  emitWinner(winner: string, gameId: string) {
    this.server.to(gameId).emit("endGame", winner);
  }

  @SubscribeMessage('UpKeyRelease')
  onUpKeyRelease(@ConnectedSocket() client: Socket, @MessageBody() data: any) : Promise<void> {
    const nickname = client.handshake.query.userID;
    if (typeof nickname !== 'string') {
        throw new SocketException('BadRequest', `query를 잘못 입력하셨습니다.`);
    }
    if (!this.gameService.isPlayer(nickname)) {
        return ;
    }
    
    const Pair = this.gameService.getPair(nickname);
    const gamedata = this.gameService.getGameData(data.gameId);
    const leftPaddle = gamedata.paddle[0];
    const rightPaddle = gamedata.paddle[1];

    if (Pair) {
        if (Pair.isLeft){
            leftPaddle.keyPress.up = false;
        } else {
            rightPaddle.keyPress.up = false;
        }
    }
}

  @SubscribeMessage('DownKeyRelease')
  onDownKeyRelease(@ConnectedSocket() client: Socket, @MessageBody() data: any) : Promise<void> {
    const nickname = client.handshake.query.userID;
    if (typeof nickname !== 'string') {
        throw new SocketException('BadRequest', `query를 잘못 입력하셨습니다.`);
    }
    if (!this.gameService.isPlayer(nickname)) {
        return ;
    }

    const Pair = this.gameService.getPair(nickname);
    const gamedata = this.gameService.getGameData(data.gameId);
    const leftPaddle = gamedata.paddle[0];
    const rightPaddle = gamedata.paddle[1];

    if (Pair) {
        if (Pair.isLeft){
            leftPaddle.keyPress.down = false;
        } else {
            rightPaddle.keyPress.down = false;
        }
    }
}

  @SubscribeMessage('UpKey')
  UpKeyPressed(@ConnectedSocket() client: Socket, @MessageBody() data: any) : Promise<void> {
        const nickname = client.handshake.query.userID;
        if (typeof nickname !== 'string') {
            throw new SocketException('BadRequest', `query를 잘못 입력하셨습니다.`);
        }
        if (!this.gameService.isPlayer(nickname)) {
            return ;
        }

        const Pair = this.gameService.getPair(nickname);
        const gamedata = this.gameService.getGameData(data.gameId);
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];

        if (Pair) {
            if (Pair.isLeft){
                leftPaddle.keyPress.up = true;
            } else {
                rightPaddle.keyPress.up = true;
            }
        }
    }

  @SubscribeMessage('DownKey')
  DownKeyPressed(@ConnectedSocket() client: Socket, @MessageBody() data: any) : Promise<void> {
        const nickname = client.handshake.query.userID;
        if (typeof nickname !== 'string') {
            throw new SocketException('BadRequest', `query를 잘못 입력하셨습니다.`);
        }
        if (!this.gameService.isPlayer(nickname)){
            return ;
        }

        const Pair = this.gameService.getPair(nickname);
        const gamedata = this.gameService.getGameData(data.gameId);
        const leftPaddle = gamedata.paddle[0];
        const rightPaddle = gamedata.paddle[1];

        if (Pair) {
            if (Pair.isLeft){
                leftPaddle.keyPress.down = true;
            } else {
                rightPaddle.keyPress.down = true;
            }
        }
    }

  async gameEnd(gamedata: GameDataDto, gameId: string) : Promise<void> {
    const   gameOptions : GameOptionDto = this.gameService.getGameOptions(gameId);
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
        if (isEnded)
            this.server.to(gameId).emit("endGame", winner);
    }
  }
}