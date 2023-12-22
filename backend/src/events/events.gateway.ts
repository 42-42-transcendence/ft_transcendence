import { Inject, UseFilters, UsePipes, ValidationPipe, forwardRef } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketException } from './socket.exception';
import { SocketExceptionFilter } from './socket.filter';
import { User } from 'src/user/entities/user.entity';
import { UserStatus } from 'src/user/enums/user-status.enum';
import { Chat } from 'src/chat/entities/chat.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { ChatService } from 'src/chat/chat.service';
import { ChatType } from 'src/chat/enums/chat-type.enum';
import { AuthService } from 'src/auth/auth.service';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelService } from 'src/channel/channel.service';
import { UserService } from 'src/user/user.service';
import { EventsService } from './events.service';
import { GameService } from 'src/game/game.service';
import { GameModeEnum } from 'src/game/enums/gameMode.enum';
import { GameDataDto, GameOptionDto } from 'src/game/dto/in-game.dto';
import { GameTypeEnum } from 'src/game/enums/gameType.enum';
import { Paddle } from 'src/game/classes/Paddle';
import { Ball } from 'src/game/classes/Ball';
import { vec2 } from 'gl-matrix';
import { NotificationService } from 'src/notification/notification.service';
import { NotiType } from 'src/notification/enums/noti-type.enum';
import { SendMessageDto } from './dto/send-message.dto';


@UseFilters(new SocketExceptionFilter())
@WebSocketGateway({
  namespace: '',
  cors: {
    origin: `http://${process.env.HOST_DOMAIN}:${process.env.HOST_PORT}`,
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private channelMemberService: ChannelMemberService,
    private chatService: ChatService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private eventsService: EventsService,
    private gameService: GameService,
    private userService: UserService,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
  ) {}

  // 다른 모듈에서 쓰기 위해 (io 역할)
  @WebSocketServer()
  public server: Server;

  afterInit(server: any) {
    console.log('[socket.io] ----------- server init ----------------------------');
  }

  async handleConnection(client: Socket) {
    try {
      const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
      const user = await this.authService.getUserByAuthWithWsException(auth);
      await this.notificationService.deleteAllGameNotiByUserID(user.userID);
      if (this.eventsService.hasClient(user.userID)) {
        const beforeClient = this.eventsService.getClient(user.userID);
        beforeClient.emit("sessionExpired", `${user.nickname}님이 다른 곳에서 새로 로그인 하셨습니다.`);
      }
      this.eventsService.addClient(user.userID, client);
      if (user.status === UserStatus.OFFLINE) {
        await this.userService.updateUserStatus(user, UserStatus.ONLINE);
      }

      console.log(`[socket.io] ----------- ${user.nickname} ${client.id} connect -------------------`);
    } catch (e) {
      console.log(e);
    }
  }

  
  async handleDisconnect(client: Socket) {
    try {
      const nickname = client.handshake.query.userID;
      if (typeof nickname !== 'string') {
        throw new SocketException('BadRequest', `query를 잘못 입력하셨습니다.`);
      }

      const waitUser = await this.userService.getUserByNicknameWithWsException(nickname);
      const waitForClient = async () => {
        await new Promise((resolve) => {
          const timerID = setInterval(() => {
            if(!this.gameService.hasClient(waitUser.userID)) {
              clearInterval(timerID);
              resolve(null);
            }
          }, 50);
        });
      };
      await waitForClient();

      const user = await this.userService.getUserByNicknameWithWsException(nickname);
      const channelMembers = await user.channelMembers;

      const leaveChannels = channelMembers.map(async channelMember => {
        const channel = await this.channelMemberService.getChannelFromChannelMember(channelMember);

        await this.leaveChannelSession(client, { channelID: channel.channelID });
      });
      await Promise.all(leaveChannels);

      this.allDeleteGameMatching(user.userID);
      const saveClient = this.eventsService.getClient(user.userID);
      // 현재 client.id와 저장하고 있는 client.id가 같을 때만 client를 지우고, status를 변경한다
      if (client.id === saveClient.id) {
        this.eventsService.removeClient(user.userID);
        if (user.status !== UserStatus.OFFLINE) {
          await this.userService.updateUserStatus(user, UserStatus.OFFLINE);
        }
      }
      await this.notificationService.deleteAllGameNotiByUserID(user.userID);

      console.log(`[socket.io] ----------- ${user.nickname} ${client.id} disconnect ----------------`);

    } catch (e) {
      console.log(e);
    }
  }


  @SubscribeMessage('joinChannel')
  async joinChannelSession(client: Socket, data: any): Promise<any> {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await this.authService.getUserByAuthWithWsException(auth);
    const channel = await this.channelService.getChannelByIdWithException(data.channelID);
    const messages = await this.chatService.getRecentHundredChatsByChannelID(channel.channelID);
    const channelMembers = await channel.channelMembers;
    const members = await this.eventsService.createEventsMembers(channelMembers, user);
    const title = channel.title;

    if (!client.rooms.has(channel.channelID)) {
      client.join(channel.channelID);
    }
    console.log(`[socket.io] ----------- join ${channel.channelID} -----------------`);

    return { title, messages, members };
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannelSession(client: Socket, data: any) {
    if (client.rooms.has(data.channelID)) {
      client.leave(data.channelID);
      console.log(`[socket.io] ----------- leave ${data.channelID} ----------------`);
    }
  }


  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe())
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageDto
  ) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await this.authService.getUserByAuthWithWsException(auth);
    const channel = await this.channelService.getChannelByIdWithException(data.channelID);
    const member = await this.channelMemberService.getChannelMemberByChannelUserWithException(channel, user);

    if (!member.isMuted) {
      const createChatMessageDto = {
        content: data.message,
        chatType: ChatType.NORMAL,
        userNickname: user.nickname,
        user,
        channel,
      };
      const chat = await this.chatService.createChatMessage(createChatMessageDto);
      this.server.to(channel.channelID).emit("updatedMessage", chat);
    }
    else {
      // 메세지 이거... db저장하면 안됨.
      const chat = this.chatService.createMuteMessage(user, channel);
      if (client && client.rooms.has(channel.channelID)) {
        client.emit("updatedMessage", chat);
      }
    }
  }

  @SubscribeMessage('notification')
  async getAllNotificationsByUser(client: Socket) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await this.authService.getUserByAuthWithWsException(auth);
    const notifications = await this.notificationService.getAllNotiByUserID(user.userID);

    return (notifications);
  }


  async updatedMessage(userID: string, channelID: string, chat: Chat) {
    const client = this.eventsService.getClient(userID);
    if (client && client.rooms.has(channelID)) {
      client.to(channelID).emit("updatedMessage", chat);
    }
  }


  async updatedMembersForAllUsers(channel: Channel) {
    const channelMembers = await channel.channelMembers;
    const emitUpdatedMembers = channelMembers.map(async member => {
      const user = await this.channelMemberService.getUserFromChannelMember(member);
      const client = this.eventsService.getClient(user.userID);
      const members = await this.eventsService.createEventsMembers(channelMembers, user);
      if (client && client.rooms.has(channel.channelID)) {
        client.emit("updatedMembers", members);
      }
    });
    await Promise.all(emitUpdatedMembers);
  }

  async updatedMembersForOneUser(user: User, channel: Channel) {
    const client = this.eventsService.getClient(user.userID);
    const channelMembers = await channel.channelMembers;
    const members = await this.eventsService.createEventsMembers(channelMembers, user);
    if (client && client.rooms.has(channel.channelID)) {
      client.emit("updatedMembers", members);
    }
  }

  async updatedSystemMessage(content: string, channel: Channel, user: User) {
    const chat = await this.chatService.createChatMessage({
      content,
      chatType: ChatType.SYSTEM,
      userNickname: user.nickname,
      channel,
      user
    });
    this.server.to(channel.channelID).emit("updatedMessage", chat);
  }

  async kickOutSpecificClient(message: string, user: User, channel: Channel) {
    const client = this.eventsService.getClient(user.userID);
    if (client) {
      client.emit('firedChannel', message);
    };
  }

  async updatedNotification(message: string, notiType: NotiType, user: User) {
    const client = this.eventsService.getClient(user.userID);
    const notification = await this.notificationService.createNotification({ message, notiType, user });
    if (client) {
      client.emit("updatedNotification", notification);
    }
  }

  async updatedNotificationWithData(message: string, notiType: NotiType, user: User, data: string) {
    const client = this.eventsService.getClient(user.userID);
    const notification = await this.notificationService.createNotificationWithData({ message, notiType, user, data });
    if (client) {
      client.emit("updatedNotification", notification);
    }
  }

  async sendInviteGameNotification(message: string, notiType: NotiType, user: User, sendUser: string) {
    const client = this.eventsService.getClient(user.userID);
    if (client && user.status === UserStatus.ONLINE) {
      const notification = await this.notificationService.createNotificationWithData({
        message,
        notiType,
        user,
        data: sendUser
      });
      client.emit("updatedNotification", notification);
    }
  }

/* ------------------ GAME --------------- */
  async sendStartGameEvent(users: User[], mode: GameModeEnum, type: GameTypeEnum) {
    const client = this.eventsService.getClient(users[0].userID);
    const sendclient = this.eventsService.getClient(users[1].userID);

    const gameOptions: GameOptionDto = {
      player1: users[0].nickname,
      player2: users[1].nickname,
      gametype: type,
      gamemode: mode,
      isActive: false,
    }

    const gamedata: GameDataDto = {
      paddle: [new Paddle(-0.96, 0), new Paddle(0.96, 0)],
      ball : new Ball(vec2.fromValues(0, 0), vec2.fromValues(1.0, 0), 1.0, 0.02),
      scores: [0, 0],
      items: [],
      lastTime: 0,
      mode: 'normal',
      intervalId: null,
    }

    const gameID = await this.eventsService.startGame(users[0].nickname, users[1].nickname, gameOptions, gamedata);
    if (gameID) {
      client.emit("startGame", { gameID: gameID, playerID: [users[0].nickname, users[1].nickname], mode: "normal" });
      sendclient.emit("startGame", { gameID: gameID, playerID: [users[0].nickname, users[1].nickname], mode: "normal" });
    }
   
    this.eventsService.g_startGameLoop(gameID);
  }

  hasAlreadyGameMatching(user: User): boolean {
    if (this.eventsService.hasNormalGameQueueUser(user.userID)
      || this.eventsService.hasObjectGameQueueUser(user.userID)) {
        return (true);
    }
    return (false);
  }

  deleteNormalGameQueueUser(userID: string) {
    this.eventsService.deleteNormalGameQueueUser(userID);
  }

  deleteObjectGameQueueUser(userID: string) {
    this.eventsService.deleteObjectGameQueueUser(userID);
  }

  allDeleteGameMatching(userID: string) {
    this.eventsService.deleteNormalGameQueueUser(userID);
    this.eventsService.deleteObjectGameQueueUser(userID);
  }

  async normalGameMatching(user: User, mode: GameModeEnum, type: GameTypeEnum) {
    const client = this.eventsService.getClient(user.userID);
    const readyUser = await this.eventsService.getReadyNormalGameUser();
    if (!readyUser) {
      this.eventsService.addNormalGameQueueUser(user.userID);
      return ;
    }
    const readyUserClient = this.eventsService.getClient(readyUser.userID);

    // 게임 룸 만들기
    const gameOptions: GameOptionDto = {
      player1: user.nickname,
      player2: readyUser.nickname,
      gametype: type,
      gamemode: mode,
      isActive: false,
    }

    const gamedata: GameDataDto = {
      paddle: [new Paddle(-0.96, 0), new Paddle(0.96, 0)],
      ball : new Ball(vec2.fromValues(0, 0), vec2.fromValues(1.0, 0), 1.0, 0.02),
      scores: [0, 0],
      items: [],
      lastTime: 0,
      mode: 'normal',
      intervalId: null,
    }

    const gameID = await this.eventsService.startGame(user.nickname, readyUser.nickname, gameOptions, gamedata);
    if (gameID) {
      client.emit("startGame", { gameID: gameID, playerID: [user.nickname, readyUser.nickname], mode: "normal" });
      readyUserClient.emit("startGame", { gameID: gameID, playerID: [user.nickname, readyUser.nickname], mode: "normal" });
    }
    
    // 게임 정상 생성 확인
    this.eventsService.g_startGameLoop(gameID);
  }

  async objectGameMatching(user: User, mode: GameModeEnum, type: GameTypeEnum) {
    const client = this.eventsService.getClient(user.userID);
    const readyUser = await this.eventsService.getReadyObjectGameUser();
    if (!readyUser) {
      this.eventsService.addObjectGameQueueUser(user.userID);
      return ;
    }
    const readyUserClient = this.eventsService.getClient(readyUser.userID);

    // 게임 룸 만들기
    const gameOptions: GameOptionDto = {
      player1: user.nickname,
      player2: readyUser.nickname,
      gametype: type,
      gamemode: mode,
      isActive: false,
    }

    const gamedata: GameDataDto = {
      paddle: [new Paddle(-0.96, 0), new Paddle(0.96, 0)],
      ball : new Ball(vec2.fromValues(0, 0), vec2.fromValues(1.0, 0), 0.5, 0.02),
      scores: [0, 0],
      items: [],
      lastTime: 0,
      mode: 'object',
      intervalId: null,
    }

    const gameID = await this.eventsService.startGame(user.nickname, readyUser.nickname, gameOptions, gamedata);
    if (gameID) {
      client.emit("startGame", { gameID: gameID, playerID: [user.nickname, readyUser.nickname], mode: "object" });
      readyUserClient.emit("startGame", { gameID: gameID, playerID: [user.nickname, readyUser.nickname], mode: "object" });
    }

    this.eventsService.g_startGameLoop(gameID);
  }
}
