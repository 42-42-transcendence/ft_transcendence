import { BadRequestException, ForbiddenException, Inject, UseFilters, forwardRef } from '@nestjs/common';
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
import { ChannelMemberDto } from 'src/channel-member/dto/channel-member.dto';
import { ChannelMember } from 'src/channel-member/entities/channel-member.entity';
import { ChannelMemberRole } from 'src/channel-member/enums/channel-member-role.enum';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatMessageDto } from 'src/chat/dto/create-chat-message.dto';
import { ChatType } from 'src/chat/enums/chat-type.enum';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { EventsService } from './events.service';
import { Chat } from 'src/chat/entities/chat.entity';
import { SocketExceptionFilter } from './socket.filter';



// @UseFilters(new SocketExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private channelMemberService: ChannelMemberService,
    private chatService: ChatService,
    private authService: AuthService,
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
      const channel = await channelMember.channel;

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
    console.log(`[socket.io] ----------- join ${data.channelID} -----------------`);

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
      client.to(channel.channelID).emit("updatedMessage", { message: chat });
    }
    else {
      const createChatMessageDto = {
        content: `${user.nickname}님은 현재 뮤트상태입니다.`,
        chatType: ChatType.SYSTEM,
        userNickname: user.nickname,
        user,
        channel,
      };
      const chat = await this.chatService.createChatMessage(createChatMessageDto);
      this.server.to(channel.channelID).to(client.id).emit("updatedMessage", { message: chat });
    }
  }

  async updatedMessage(userID: string, channelID: string, chat: Chat) {
    const client = this.eventsService.getClient(userID);
    client.to(channelID).emit("updatedMessage", { message: chat });
  }


  async updatedMembersForAllUsers(channel: Channel) {
    const channelMembers = await channel.channelMembers;
    const emitUpdatedMembers = channelMembers.map(async member => {
      const user = await member.user;
      const client = this.eventsService.getClient(user.userID);
      if (client === undefined || !client.rooms.has(channel.channelID)) {
        return ;
      }
      const members = await this.eventsService.createEventsMembers(channelMembers, user);
      this.server.to(channel.channelID).to(client.id).emit("updatedMembers", { members: members });
    });
    await Promise.all(emitUpdatedMembers);
  }

  async updatedMembersForOneUser(user: User, channel: Channel) {
    const client = this.eventsService.getClient(user.userID);
    const channelMembers = await channel.channelMembers;
    const members = await this.eventsService.createEventsMembers(channelMembers, user);
    this.server.to(channel.channelID).to(client.id).emit("updatedMembers", { members: members });
  }

  async updatedSystemMessage(content: string, channel: Channel, user: User) {
    const chat = await this.chatService.createChatMessage({
      content,
      chatType: ChatType.SYSTEM,
      userNickname: user.nickname,
      channel,
      user
    });
    this.server.to(channel.channelID).emit("updatedMessage", { message: chat });
  }

  async kickOutSpecificClient(message: string, user: User, channel: Channel) {
    const client = this.eventsService.getClient(user.userID);
    if (client) {
      this.server.to(channel.channelID).to(client.id).emit(
        'firedChannel',
        { message: message }
      )
    };
  }
}
