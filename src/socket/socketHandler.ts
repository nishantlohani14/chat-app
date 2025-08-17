import { Server, Socket } from 'socket.io';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData,
  ChatMessage,
  User
} from '../types';
import { ChatService } from '../services/chatService';

export class SocketHandler {
  private chatService: ChatService;

  constructor(private io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    this.chatService = new ChatService();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
      console.log(`User connected: ${socket.id}`);

      // Set default username
      socket.data.username = `User_${socket.id.slice(0, 6)}`;

      // Add user to chat service
      const user: User = {
        id: socket.id,
        username: socket.data.username,
        connectedAt: new Date()
      };
      this.chatService.addUser(user);

      // Send current user list to the new user
      socket.emit('userList', this.chatService.getUsers());

      // Notify others about new user
      socket.broadcast.emit('userJoined', user);

      // Send recent messages
      const recentMessages = this.chatService.getMessages();
      recentMessages.forEach(message => {
        socket.emit('message', message);
      });

      // Handle join room
      socket.on('joinRoom', (room: string, callback) => {
        try {
          if (socket.data.room) {
            socket.leave(socket.data.room);
          }
          
          socket.join(room);
          socket.data.room = room;
          this.chatService.updateUserRoom(socket.id, room);
          
          // Send room-specific messages
          const roomMessages = this.chatService.getMessages(room);
          roomMessages.forEach(message => {
            socket.emit('message', message);
          });
          
          // Send room user list
          socket.emit('userList', this.chatService.getUsers(room));
          
          // Notify room about new user
          socket.to(room).emit('userJoined', user);
          
          callback(true);
        } catch (error) {
          console.error('Error joining room:', error);
          callback(false);
        }
      });

      // Handle leave room
      socket.on('leaveRoom', (callback) => {
        try {
          if (socket.data.room) {
            socket.leave(socket.data.room);
            socket.data.room = undefined;
            this.chatService.updateUserRoom(socket.id, '');
            callback(true);
          } else {
            callback(false);
          }
        } catch (error) {
          console.error('Error leaving room:', error);
          callback(false);
        }
      });

      // Handle send message
      socket.on('sendMessage', (message: string, callback) => {
        try {
          if (!message.trim()) {
            callback(false);
            return;
          }

          const chatMessage: ChatMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            username: socket.data.username,
            message: message.trim(),
            timestamp: new Date(),
            room: socket.data.room
          };

          this.chatService.addMessage(chatMessage);

          if (socket.data.room) {
            // Send to room
            this.io.to(socket.data.room).emit('message', chatMessage);
          } else {
            // Send to all
            this.io.emit('message', chatMessage);
          }

          callback(true);
        } catch (error) {
          console.error('Error sending message:', error);
          callback(false);
        }
      });

      // Handle set username
      socket.on('setUsername', (username: string, callback) => {
        try {
          const trimmedUsername = username.trim();
          
          if (!trimmedUsername || trimmedUsername.length < 2) {
            callback(false);
            return;
          }

          if (this.chatService.isUsernameTaken(trimmedUsername, socket.id)) {
            callback(false);
            return;
          }

          const oldUsername = socket.data.username;
          socket.data.username = trimmedUsername;
          this.chatService.updateUsername(socket.id, trimmedUsername);

          // Update user object
          const user = this.chatService.getUser(socket.id);
          if (user) {
            user.username = trimmedUsername;
          }

          // Notify others about username change
          const systemMessage = `${oldUsername} is now known as ${trimmedUsername}`;
          if (socket.data.room) {
            socket.to(socket.data.room).emit('systemMessage', systemMessage);
          } else {
            socket.broadcast.emit('systemMessage', systemMessage);
          }

          callback(true);
        } catch (error) {
          console.error('Error setting username:', error);
          callback(false);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        const user = this.chatService.removeUser(socket.id);
        if (user) {
          if (socket.data.room) {
            socket.to(socket.data.room).emit('userLeft', socket.id);
          } else {
            socket.broadcast.emit('userLeft', socket.id);
          }
        }
      });
    });
  }
}
