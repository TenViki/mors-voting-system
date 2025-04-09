"use server";

import { getSocketService } from "@/types/socket";
import { validateAdmin } from "./admin";
import prisma from "@/lib/prisma";

export const getIfVoteOpen = async () => {
  const isVoteOpen = await prisma.settings.findFirst({
    where: {
      name: "isVoteOpen",
    },
  });
  if (!isVoteOpen) {
    return false;
  }

  return isVoteOpen.value === "true";
};

export const setVoteOpen = async (isOpen: boolean) => {
  await validateAdmin();

  const isVoteOpen = await prisma.settings.findFirst({
    where: {
      name: "isVoteOpen",
    },
  });

  if (!isVoteOpen) {
    await prisma.settings.create({
      data: {
        name: "isVoteOpen",
        value: isOpen ? "true" : "false",
      },
    });
  } else {
    await prisma.settings.update({
      where: {
        id: isVoteOpen.id,
      },
      data: {
        value: isOpen ? "true" : "false",
      },
    });
  }

  if (isOpen) {
    const allVotes = await prisma.vote.findMany({
      orderBy: {
        id: "asc",
      },
    });
    getSocketService().broadcastToAll("votes:update", allVotes);
  }

  getSocketService().broadcastToAll("voting:state", isOpen);

  return isOpen;
};
