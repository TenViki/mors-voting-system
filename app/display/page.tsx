import { getVoteKey, validateVoteKey } from "@/actions/votekey";
import VoteKeyLogin from "@/VoteKeyLogin";
import React from "react";
import DisplayVotes from "./DisplayVotes";

const page = async () => {
  const isKeyValid = await validateVoteKey(false);
  if (!isKeyValid) {
    return <VoteKeyLogin />;
  }

  const voteKey = await getVoteKey();

  return <DisplayVotes voteKey={voteKey} />;
};

export default page;
