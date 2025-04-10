"use server";

import prisma from "@/lib/prisma";
import { getSocketService } from "@/types/socket";
import { validateAdmin } from "./admin";
import { validateUser } from "./auth";

export const toggleQueue = async () => {
  const user = await validateUser();

  const queuePos = await prisma.queuePosition.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (queuePos) {
    await prisma.queuePosition.delete({
      where: {
        id: queuePos.id,
      },
    });

    getSocketService().broadcastToRoom(user.id, "queue:leave");
  } else {
    const q = await prisma.queuePosition.create({
      data: {
        userId: user.id,
      },
    });
    getSocketService().broadcastToRoom(user.id, "queue:join", q.id);
  }

  const queuePositions = await getQueue();

  getSocketService().broadcastToAll("queue:update", queuePositions);
};

export const getQueue = async () => {
  return prisma.queuePosition.findMany({
    where: {
      isActive: true,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const moveQueue = async () => {
  await validateAdmin();

  const firstPos = await prisma.queuePosition.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!firstPos) return;
  await prisma.queuePosition.delete({
    where: {
      id: firstPos.id,
    },
  });

  const queuePositions = await getQueue();
  getSocketService().broadcastToAll("queue:update", queuePositions);
  getSocketService().broadcastToRoom(firstPos.userId, "queue:leave");
};
