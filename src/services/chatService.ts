import { ChatMessage, User } from '../types';

export class ChatService {
  private messages: ChatMessage[] = [];
  private users: Map<string, User> = new Map();
  private readonly MAX_MESSAGES = 100;

  addMessage(message: ChatMessage): void {
    this.messages.push(message);
    
    // Keep only the last MAX_MESSAGES messages
    if (this.messages.length > this.MAX_MESSAGES) {
      this.messages = this.messages.slice(-this.MAX_MESSAGES);
    }
  }

  getMessages(room?: string): ChatMessage[] {
    if (!room) {
      return this.messages;
    }
    return this.messages.filter(msg => msg.room === room);
  }

  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  removeUser(userId: string): User | undefined {
    const user = this.users.get(userId);
    if (user) {
      this.users.delete(userId);
    }
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getUsers(room?: string): User[] {
    const allUsers = Array.from(this.users.values());
    if (!room) {
      return allUsers;
    }
    return allUsers.filter(user => user.room === room);
  }

  updateUserRoom(userId: string, room: string): boolean {
    const user = this.users.get(userId);
    if (user) {
      user.room = room;
      return true;
    }
    return false;
  }

  updateUsername(userId: string, username: string): boolean {
    const user = this.users.get(userId);
    if (user) {
      user.username = username;
      return true;
    }
    return false;
  }

  isUsernameTaken(username: string, excludeUserId?: string): boolean {
    return Array.from(this.users.values()).some(
      user => user.username === username && user.id !== excludeUserId
    );
  }
}
