import Image from "next/image";
import { getSocketService, SocketService } from "./types/socket";

// define socketService as global variable
declare global {
  interface Window {
    socketService: SocketService;
  }
}

export default function Home() {
  const connectedClients = getSocketService().getConnectedClients();
  const random = Math.random();

  getSocketService().broadcastToAll("newLoad", random);

  console.log(connectedClients);

  return (
    <div>
      <h1 className="text-2xl font-bold">Connected Clients</h1>
      <ul className="list-disc pl-5">
        {Array.from(connectedClients.entries()).map(([userId, socket]) => (
          <li key={userId} className="py-2">
            <span className="ml-2">{userId}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
