import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface ConnectedUser {
  socketId: string;
  userId: string;
  email: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust for production
  },
})
@Injectable()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, ConnectedUser>(); // userId -> ConnectedUser

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

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
      const email = payload.email;

      // Check if user is already connected (prevent duplicates)
      if (this.connectedUsers.has(userId)) {
        console.log(`User ${userId} already connected, disconnecting old connection`);
        const oldConnection = this.connectedUsers.get(userId);
        if (oldConnection) {
          const oldClient = this.server.sockets.sockets.get(oldConnection.socketId);
          oldClient?.disconnect();
        }
      }

      this.connectedUsers.set(userId, { socketId: client.id, userId, email });
      console.log(`User ${email} (${userId}) connected. Total online: ${this.connectedUsers.size}`);
      
      // Emit to all clients that a user came online
      this.server.emit('user_online', { userId, email });
      
      // Send current list of online users to the newly connected user
      const onlineUsersList = Array.from(this.connectedUsers.values()).map(u => ({
        userId: u.userId,
        email: u.email,
      }));
      client.emit('online_users_list', { users: onlineUsersList });
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    let disconnectedUser: ConnectedUser | null = null;
    for (const [userId, userInfo] of this.connectedUsers.entries()) {
      if (userInfo.socketId === client.id) {
        this.connectedUsers.delete(userId);
        disconnectedUser = userInfo;
        console.log(`User ${userInfo.email} (${userId}) disconnected. Total online: ${this.connectedUsers.size}`);
        break;
      }
    }

    if (disconnectedUser) {
      // Emit to all clients that a user went offline
      this.server.emit('user_offline', { userId: disconnectedUser.userId, email: disconnectedUser.email });
    }
  }

  emitToUser(userId: string, event: string, data: any) {
    const userInfo = this.connectedUsers.get(userId);
    if (userInfo) {
      this.server.to(userInfo.socketId).emit(event, data);
    }
  }

  getOnlineUsers(): ConnectedUser[] {
    return Array.from(this.connectedUsers.values());
  }

  getOnlineUserEmails(): string[] {
    return Array.from(this.connectedUsers.values()).map(u => u.email);
  }
}
