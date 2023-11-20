import { BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import {
  MessageBody,
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
    const user = await auth.user;
    console.log(`[socket.io] ----------- ${user.nickname} connect -------------------`);
  }

  async handleDisconnect(client: Socket) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await auth.user;
    const channelMembers = await user.channelMembers;

    channelMembers.forEach(async (channelMember) => {
      const channel = await channelMember.channel;
      const createChatMessageDto = {
        content: `${user.nickname}님께서 퇴장하셨습니다.`,
        chatType: ChatType.SYSTEM,
        user,
        channel,
      };
      this.sendMessage(client, 'leaveChannelMsg', createChatMessageDto);
      client.leave(channel.channelID);
    });
    console.log(`[socket.io] ----------- ${user.nickname} disconnect ----------------`);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, data: any): Promise<any> {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const user = await auth.user;
    const channel = await this.channelService.getChannelByIdWithException(data.channelID);
    const member = await this.channelMemberService.getChannelMemberByChannelUser(channel, user);

    if (!member) {
      this.channelMemberService.relationChannelMember({
        channel,
        user,
        role: ChannelMemberRole.GUEST,
      });
    } else if (member.role === ChannelMemberRole.BLOCK) {
      throw new BadRequestException(`${user.nickname}은 채널에 입장할 수 없습니다.`);
    }

    if (!client.rooms.has(channel.channelID)) {
      client.join(channel.channelID);
    }

    // update
    const createChatMessageDto = {
      content: `${user.nickname}님께서 입장하셨습니다.`,
      chatType: ChatType.SYSTEM,
      user,
      channel,
    };

    await this.chatService.createChatMessage(createChatMessageDto);

    const newChannel = this.channelService.getChannelAllInfoById(channel.channelID);
    await user.subjectRelations;

    // return

    // this.sendMessage(client, "updatedMessage", createChatMessageDto);
    // this.sendMessage(client, "updatedUsers", allUsers)
    // this.sendMessage(client, "firedChannel", message)

    console.log(`[socket.io] ----------- join ${data.channelID} -----------------`);

    return { newChannel, user };
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(client: Socket, data: any) {
    ``;
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const channel = await this.channelService.getChannelById(data.channelID);
    const user = await auth.user;
    const createChatMessageDto = {
      content: `${user.nickname}님께서 퇴장하셨습니다.`,
      chatType: ChatType.SYSTEM,
      user,
      channel,
    };
    this.sendMessage(client, 'leaveChannelMsg', createChatMessageDto);
    client.leave(data.channelID);
    console.log(`[socket.io] ----------- leave ${data.channelID} ----------------`);
  }

  @SubscribeMessage('sendMessageToChannel')
  async sendMessageToChannel(client: Socket, data: any) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const channel = await this.channelService.getChannelById(data.channelID);
    const user = await auth.user;
    const createChatMessageDto = {
      content: data.message,
      chatType: ChatType.NORMAL,
      user,
      channel,
    };
    this.sendMessage(client, 'sendMessageToChannel', createChatMessageDto);
  }

  @SubscribeMessage('inviteChannel')
  async inviteChannel(client: Socket, data: any) {
    const auth = await this.authService.checkAuthByJWT(client.handshake.auth.token);
    const channel = await this.channelService.getChannelById(data.channelID);
    const authUser = await auth.user;
    const inviteUser = await this.userService.getUserByNickname(data.nickname);

    if (this.channelMemberService.checkChannelMember(channel, inviteUser)) {
      throw new BadRequestException(`${inviteUser.nickname}은 현재 채널에 존재합니다.`);
    }

    if (!this.channelMemberService.hasAuthMemberToChannel(channel, authUser)) {
      throw new ForbiddenException(`${authUser.nickname}은 초대권한이 없습니다.`);
    }

    const chennelMemberDto = {
      channel,
      user: inviteUser,
      role: ChannelMemberRole.INVITE,
    };

    await this.channelMemberService.relationChannelMember(chennelMemberDto);

    // 해당 유저에게만 초대된걸 어떻게 보내지?
  }

  private async sendMessage(client: Socket, events: string, createChatMessageDto: CreateChatMessageDto) {
    const chat = await this.chatService.createChatMessage(createChatMessageDto);
    client.to(createChatMessageDto.channel.channelID).emit(events, chat);
  }

  async updateChannelMembers(client: Socket, channel: Channel, events: string) {
    const channelMembers = await channel.channelMembers;
    this.server.to(channel.channelID).emit(events, channelMembers);
  }
}
