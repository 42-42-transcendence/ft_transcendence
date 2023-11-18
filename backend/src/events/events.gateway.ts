import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000'
  }
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

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

  @SubscribeMessage('joinChannel')
  joinChannel(client: Socket, data: any) {
    if (client.rooms.has(data.channelID)) {
      return ;
    }
    client.join(data.channelID);

    client.emit("updateChats", )
    // client.to(data.channelID).emit('joinChannelMsg', 'aaaaaa');
    console.log(`[socket.io] ----------- join ${data.channelID} -----------------`);
  }

  @SubscribeMessage('leaveChannel')
  leaveChannel(client: Socket, data: any) {
    client.leave(data.channelID);
    // client.to(data.channelID).emit('leaveChannelMsg', 'bbbbbb');
    console.log(`[socket.io] ----------- leave ${data.channelID} ----------------`);
  }
}
