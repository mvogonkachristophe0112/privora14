import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust for production
  },
})
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.query.token;
      if (!token) {
        console.log('Connection rejected: No token provided');
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Check if user is already connected (prevent duplicates)
      if (this.connectedUsers.has(userId)) {
        console.log(`User ${userId} already connected, disconnecting old connection`);
        const oldSocketId = this.connectedUsers.get(userId);
        if (oldSocketId) {
          const oldClient = this.server.sockets.sockets.get(oldSocketId);
          oldClient?.disconnect();
        }
      }

      this.connectedUsers.set(userId, client.id);
      console.log(`User ${userId} connected. Total online: ${this.connectedUsers.size}`);
      // Emit to all clients that a user came online
      this.server.emit('user_online', { userId, email: payload.email });
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    let disconnectedUserId: string | null = null;
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        disconnectedUserId = userId;
        console.log(`User ${userId} disconnected. Total online: ${this.connectedUsers.size}`);
        break;
      }
    }

    if (disconnectedUserId) {
      // Emit to all clients that a user went offline
      this.server.emit('user_offline', { userId: disconnectedUserId });
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}
