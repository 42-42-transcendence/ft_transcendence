import { Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { authenticate } from 'passport';
import { Server, Socket } from 'socket.io';
import { Auth } from 'src/auth/entities/auth.entity';
import { GetAuth } from 'src/auth/get-auth.decorator';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelService } from 'src/channel/channel.service';
import { ChatService } from 'src/chat/chat.service';
import { ChatType } from 'src/chat/enums/chat-type.enum';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000'
  }
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  constructor(
    private channelService: ChannelService,
    private channelMemberService: ChannelMemberService,
    private chatService: ChatService,
  ) {}

  // 다른 모듈에서 쓰기 위해 (io 역할)
  @WebSocketServer()
  public server: Server

  afterInit(server: any) {
    console.log('[socket.io] ----------- server init ----------------------------');
  }

  handleConnection(client: Socket) {
    console.log(`[socket.io] ----------- ${client.id} connect -------------------`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[socket.io] ----------- ${client.id} disconnect ----------------`);
  }

  @UseGuards(AuthGuard())
  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, data: any, @GetAuth() auth: Auth) {
    if (!client.rooms.has(data.channelID)) {
      client.join(data.channelID);
    }

    const channel = await this.channelService.getChannelAllInfo(data.channelID);

    client.emit("joinChannel", channel);

    const user = await auth.user;
    const createChatMessageDto = {
      content: `${user.nickname}님께서 입장하셨습니다.`,
      chatType: ChatType.SYSTEM,
      user,
      channel
    };

    const chat = await this.chatService.createChatMessage(createChatMessageDto);

    client.to(data.channelID).emit("joinChannelMessage", chat);
    // client.to(data.channelID).emit('joinChannelMsg', 'aaaaaa');
    console.log(`[socket.io] ----------- join ${data.channelID} -----------------`);
  }

  @UseGuards(AuthGuard())
  @SubscribeMessage('leaveChannel')
  async leaveChannel(client: Socket, data: any, @GetAuth() auth: Auth) {

    const channel = await this.channelService.getChannelById(data.channelID);
    const user = await auth.user;
    const createChatMessageDto = {
      content: `${user.nickname}님께서 퇴장하셨습니다.`,
      chatType: ChatType.SYSTEM,
      user,
      channel
    };

    const chat = await this.chatService.createChatMessage(createChatMessageDto);

    client.to(data.channelID).emit("leaveChannelMessage", chat);

    client.leave(data.channelID);
    // client.to(data.channelID).emit('leaveChannelMsg', 'bbbbbb');
    console.log(`[socket.io] ----------- leave ${data.channelID} ----------------`);
  }

  @SubscribeMessage('sendMessageToChannel')
  async sendMessageToChannel(client: Socket, data: any) {
  }
}
