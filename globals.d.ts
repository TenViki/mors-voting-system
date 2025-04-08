import { SocketService } from "./app/types/socket";

// define socketService as global variable
declare global {
  interface Window {
    socketService: SocketService;
  }
}
