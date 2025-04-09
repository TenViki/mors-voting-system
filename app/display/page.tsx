import { validateVoteKey } from "@/actions/votekey";
import VoteKeyLogin from "@/VoteKeyLogin";
import React from "react";
import DisplayVotes from "./DisplayVotes";

const page = async () => {
  const key = await validateVoteKey(false);
  if (!key) {
    return <VoteKeyLogin />;
  }

  return <DisplayVotes />;
};

export default page;
