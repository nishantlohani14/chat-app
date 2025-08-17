export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  room?: string;
}

export interface User {
  id: string;
  username: string;
  room?: string;
  connectedAt: Date;
}

export interface ServerToClientEvents {
  message: (message: ChatMessage) => void;
  userJoined: (user: User) => void;
  userLeft: (userId: string) => void;
  userList: (users: User[]) => void;
  systemMessage: (message: string) => void;
}

export interface ClientToServerEvents {
  joinRoom: (room: string, callback: (success: boolean) => void) => void;
  leaveRoom: (callback: (success: boolean) => void) => void;
  sendMessage: (message: string, callback: (success: boolean) => void) => void;
  setUsername: (username: string, callback: (success: boolean) => void) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
  room?: string;
}
