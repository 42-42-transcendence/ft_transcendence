import { Inject, UseFilters, forwardRef } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';
import { ChatService } from 'src/chat/chat.service';
import { ChatType } from 'src/chat/enums/chat-type.enum';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { EventsService } from './events.service';
import { Chat } from 'src/chat/entities/chat.entity';
import { SocketExceptionFilter } from './socket.filter';
import { NotificationService } from 'src/notification/notification.service';
import { NotiType } from 'src/notification/enums/noti-type.enum';



@UseFilters(new SocketExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private channelMemberService: ChannelMemberService,
    private chatService: ChatService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private eventsService: EventsService,
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
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await this.authService.getUserByAuthWithWsException(auth);
    this.eventsService.addClient(user.userID, client);

    console.log(`[socket.io] ----------- ${user.nickname} connect -------------------`);
  }

  async handleDisconnect(client: Socket) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await this.authService.getUserByAuthWithWsException(auth);
    const channelMembers = await user.channelMembers;

    const leaveChannels = channelMembers.map(async channelMember => {
      const channel = await this.channelMemberService.getChannelFromChannelMember(channelMember);

      await this.leaveChannelSession(client, { channelID: channel.channelID });
    });
    await Promise.all(leaveChannels);

    this.eventsService.removeClient(user.userID);

    console.log(`[socket.io] ----------- ${user.nickname} disconnect ----------------`);
  }


  @SubscribeMessage('joinChannel')
  async joinChannelSession(client: Socket, data: any): Promise<any> {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await this.authService.getUserByAuthWithWsException(auth);
    const channel = await this.channelService.getChannelByIdWithException(data.channelID);
    const messages = await channel.chats;
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
  async sendMessage(client: Socket, data: any) {
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

  async updatedNotificationWithChannelID(message: string, notiType: NotiType, user: User, channelID: string) {
    const client = this.eventsService.getClient(user.userID);
    const notification = await this.notificationService.createNotificationWithChannelID({ message, notiType, user, channelID });
    if (client) {
      client.emit("updatedNotification", notification);
    }
  }

}
