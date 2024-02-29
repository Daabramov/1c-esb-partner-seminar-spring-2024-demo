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
import { Socket, Server } from 'socket.io';
import { EventDto } from './events.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: [process.env.CORS || '*'],
  },
})
export class WssGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WssGateway.name);

  afterInit() {
    this.logger.log('WS Server started');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Connected ${client.id}`);
  }

  @SubscribeMessage('join-room')
  JoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): string {
    client.join(data.roomId);
    return JSON.stringify({
      clientId: client.id,
      roomId: data.roomId,
      status: 'JOINED',
    });
  }

  @SubscribeMessage('leave-room')
  LeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): string {
    client.leave(data.roomId);
    return JSON.stringify({
      clientId: client.id,
      roomId: data.roomId,
      status: 'LEFT',
    });
  }

  PostRequestEvent(event: EventDto) {
    const roomId = `task-${event.id}`;
    this.logger.debug(`new event to room ${roomId}`);
    this.server
      .to(roomId)
      .emit('events', JSON.stringify(event));
    this.logger.log(`new task event: ${event.id}`);
  }
}
