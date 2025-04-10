"use server";

import prisma from "@/lib/prisma";
import { getSocketService } from "@/types/socket";
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
    await prisma.queuePosition.create({
      data: {
        userId: user.id,
      },
    });
    getSocketService().broadcastToRoom(user.id, "queue:join");
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
