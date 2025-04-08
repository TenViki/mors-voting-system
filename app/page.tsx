import Image from "next/image";
import { getSocketService, SocketService } from "./types/socket";
import VotePage from "./vote/VotePage";

// define socketService as global variable
declare global {
  interface Window {
    socketService: SocketService;
  }
}

export default function Home() {
  return <VotePage />;
}
