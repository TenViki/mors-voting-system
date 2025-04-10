"use server";

import prisma from "@/lib/prisma";
import { getSocketService } from "@/types/socket";
import { validateAdmin } from "./admin";

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      currentVote: true,
    },
  });

  return users;
};

export const addUsers = async (users: string[]) => {
  await validateAdmin();

  const data = await prisma.user.createMany({
    data: users.map((user) => ({
      name: user,
    })),
  });

  return data;
};

export const resetUsers = async () => {
  await validateAdmin();

  const data = await prisma.user.deleteMany();
  return data;
};

export const kickUser = async (userId: string) => {
  await validateAdmin();

  const data = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      socketId: null,
    },
  });

  getSocketService().broadcastToAll("user:logoff", data);
  getSocketService().broadcastToRoom(userId, "user:kick");

  return data;
};
