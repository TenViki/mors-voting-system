import prisma from "@/lib/prisma";
import { getSocketService } from "@/types/socket";
import { jwtVerify } from "jose";
import { Socket } from "socket.io";

const handleSocketDisconnect = async (socket: Socket) => {
  const socketId = socket.id;

  let user = await prisma.user.findFirst({
    where: {
      socketId,
    },
  });
  if (!user) return;

  user = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      socketId: null,
    },
  });

  getSocketService().broadcastToAll("user:logoff", user);
};

const handleClientAuth = async (socket: Socket, token: string) => {
  console.log("Authenticating user", token);

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET as string)
    );
    let user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
    });

    if (!user || user.socketId) {
      socket.emit("user:auth_res", false);
      return;
    }

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        socketId: socket.id,
      },
    });

    socket.emit("user:auth_res", true);
    getSocketService().broadcastToAll("user:logon", user);
  } catch (error) {
    console.error("Error authenticating user", error);
    socket.emit("user:auth_res", false);
    return;
  }
};

export default async () => {
  setTimeout(() => {
    getSocketService().registerCallback("disconnect", handleSocketDisconnect);
    getSocketService().registerCallback("user:auth", handleClientAuth);
  }, 200);
};
