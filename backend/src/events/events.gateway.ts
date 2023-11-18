import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatMessageDto } from 'src/chat/dto/create-chat-message.dto';
import { ChatType } from 'src/chat/enums/chat-type.enum';
import { User } from 'src/user/entities/user.entity';

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
    private authService: AuthService,
  ) {}

  // 다른 모듈에서 쓰기 위해 (io 역할)
  @WebSocketServer()
  public server: Server

  afterInit(server: any) {
    console.log('[socket.io] ----------- server init ----------------------------');
  }

  async handleConnection(client: Socket) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await auth.user;
    console.log(`[socket.io] ----------- ${user.nickname} connect -------------------`);
  }

  async handleDisconnect(client: Socket) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await auth.user;
    const channelMembers = await user.channelMembers;

    channelMembers.forEach(async channelMember => {
      const channel = await channelMember.channel;
      const createChatMessageDto = {
        content: `${user.nickname}님께서 퇴장하셨습니다.`,
        chatType: ChatType.SYSTEM,
        user,
        channel
      };
      this.sendMessage(client, 'leaveChannelMsg', createChatMessageDto);
      client.leave(channel.channelID);
    })
    console.log(`[socket.io] ----------- ${user.nickname} disconnect ----------------`);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, data: any) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);

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
    this.sendMessage(client, "joinChannelMessage", createChatMessageDto);

    console.log(`[socket.io] ----------- join ${data.channelID} -----------------`);
  }


  @SubscribeMessage('leaveChannel')
  async leaveChannel(client: Socket, data: any) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const channel = await this.channelService.getChannelById(data.channelID);
    const user = await auth.user;
    const createChatMessageDto = {
      content: `${user.nickname}님께서 퇴장하셨습니다.`,
      chatType: ChatType.SYSTEM,
      user,
      channel
    };
    this.sendMessage(client, 'leaveChannelMsg', createChatMessageDto);
    client.leave(data.channelID);
    console.log(`[socket.io] ----------- leave ${data.channelID} ----------------`);
  }

  private async sendMessage(client: Socket, events: string, createChatMessageDto: CreateChatMessageDto) {
    const chat = await this.chatService.createChatMessage(createChatMessageDto);
    client.to(createChatMessageDto.channel.channelID).emit(events, chat);
  }

  @SubscribeMessage('sendMessageToChannel')
  async sendMessageToChannel(client: Socket, data: any) {
  }
}
