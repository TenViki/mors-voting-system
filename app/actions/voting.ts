"use server";

import prisma from "@/lib/prisma";
import { validateVoteKey } from "./votekey";
import { validateUser } from "./auth";
import { getSocketService } from "@/types/socket";

export const registerVote = async (voteId: string) => {
  await validateVoteKey();
  const user = await validateUser();

  if (user.currentVoteId) {
    throw new Error("User has already voted");
  }

  const vote = await prisma.vote.findUnique({
    where: {
      id: voteId,
    },
  });

  if (!vote) {
    throw new Error("Vote not found");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      currentVoteId: vote.id,
    },
  });

  const updatedUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  const updatedVote = await prisma.vote.update({
    where: {
      id: vote.id,
    },
    data: {
      votes: {
        increment: 1,
      },
    },
  });

  const allVotes = await prisma.vote.findMany();

  const socketService = getSocketService();
  socketService.broadcastToAll("votes:update", allVotes);
  socketService.broadcastToRoom(user.id, "user:vote", true);
  socketService.broadcastToAll("user:vote_select", {
    userId: user.id,
    currentVote: updatedVote,
  });

  return updatedUser;
};
