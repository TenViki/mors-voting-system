import { validateUser } from "./actions/auth";
import { SocketService } from "./types/socket";
import UserLogin from "./UserLogin";
import VotePage from "./vote/VotePage";

// define socketService as global variable
declare global {
  interface Window {
    socketService: SocketService;
  }
}

export default async function Home() {
  const user = await validateUser(false);

  if (!user) {
    return <UserLogin />;
  }

  return <VotePage />;
}
