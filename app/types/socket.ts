import { Socket } from "socket.io";

// types/socket.ts

export interface ClientToServerEvents {
  sendMessage: (content: string, callback: (messageId: string) => void) => void;
  joinRoom: (roomId: string) => void;
  typing: (isTyping: boolean) => void;
}

export interface InterServerEvents {
  userUpdate: (userId: string) => void;
}

export interface SocketService {
  getConnectedClients: () => Map<string, Socket>;
  getClientCount: () => number;
  broadcastToAll: (event: string, ...args: any) => void;
  broadcastToRoom: (roomId: string, event: string, ...args: any) => void;
  registerCallback: (
    event: string,
    callback: (socket: Socket, ...args: any) => void
  ) => void;
}

// Function to access the global socket service
export function getSocketService(): SocketService {
  if (typeof global !== "undefined" && (global as any).socketService) {
    return (global as any).socketService;
  }
  throw new Error("Socket service not initialized");
}

// define socketService as global variable
declare global {
  interface Window {
    socketService: SocketService;
  }
}
