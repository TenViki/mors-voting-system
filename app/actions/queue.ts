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

export const clearQueue = async () => {
  await validateAdmin();

  await prisma.queuePosition.deleteMany({
    where: {
      isActive: true,
    },
  });

  getSocketService().broadcastToAll("queue:update", []);
  getSocketService().broadcastToAll("queue:leave");
};

export const getQueueState = async () => {
  const q = await prisma.settings.findFirst({
    where: {
      name: "queueEnabled",
    },
  });

  console.log("Queue state", q);

  if (!q || !q.value) {
    return true;
  }

  return q.value === "true";
};

export const toggleQueueState = async () => {
  await validateAdmin();

  let q = await prisma.settings.findFirst({
    where: {
      name: "queueEnabled",
    },
  });

  if (!q) {
    await prisma.settings.create({
      data: {
        name: "queueEnabled",
        value: "true",
      },
    });

    getSocketService().broadcastToAll("queue:enabled");
  } else {
    q = await prisma.settings.update({
      where: {
        id: q.id,
      },
      data: {
        value: q.value === "true" ? "false" : "true",
      },
    });

    if (q.value === "true") {
      getSocketService().broadcastToAll("queue:enabled");
    } else {
      getSocketService().broadcastToAll("queue:disabled");
    }
  }
};
