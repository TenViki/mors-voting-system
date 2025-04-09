"use server";

import prisma from "@/lib/prisma";
import { getSocketService } from "@/types/socket";
import { voteTemplates } from "@/types/templates";
import { validateAdmin } from "./admin";
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
  await validateAdmin();

  const vote = await prisma.vote.create({
    data: {
      name,
    },
  });

  getSocketService().broadcastToAll("votes:add", vote);
  return vote;
};

export const clearVotes = async () => {
  await validateAdmin();
  await prisma.vote.deleteMany();
  await setVoteOpen(false);

  getSocketService().broadcastToAll("votes:clear");
};

export const applyTemplate = async (name: string) => {
  await validateAdmin();

  const template = voteTemplates.find((t) => t.name === name);
  if (!template) throw new Error("Template not found");

  await prisma.vote.createMany({
    data: template.values.map((v) => ({
      name: v,
    })),
  });

  const votes = await prisma.vote.findMany();
  getSocketService().broadcastToAll("votes:template", votes);
};
