import { validateUser } from "./actions/auth";
import { validateVoteKey } from "./actions/votekey";
import { SocketService } from "./types/socket";
import UserLogin from "./UserLogin";
import VotePage from "./vote/VotePage";
import VoteKeyLogin from "./VoteKeyLogin";

// define socketService as global variable
declare global {
  interface Window {
    socketService: SocketService;
  }
}

export default async function Home() {
  const key = await validateVoteKey(false);
  if (!key) {
    return <VoteKeyLogin />;
  }

  const user = await validateUser(false);

  if (!user) {
    return <UserLogin />;
  }

  return <VotePage />;
}
