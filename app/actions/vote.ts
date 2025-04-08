"use server";

import prisma from "@/lib/prisma";
import { getSocketService } from "@/types/socket";
import { getIfVoteOpen, setVoteOpen } from "./settings";

export const getVotes = async () => {
  const votes = await prisma.vote.findMany();
  const isopen = await getIfVoteOpen();

  return {
    votes,
    open: isopen,
  };
};

export const addVote = async (name: string) => {
  const vote = await prisma.vote.create({
    data: {
      name,
    },
  });

  getSocketService().broadcastToAll("votes:add", vote);
  return vote;
};

export const clearVotes = async () => {
  await prisma.vote.deleteMany();
  await setVoteOpen(false);

  getSocketService().broadcastToAll("votes:clear");
};
