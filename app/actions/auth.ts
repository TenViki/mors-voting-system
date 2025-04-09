"use server";

import prisma from "@/lib/prisma";
import { getSocketService } from "@/types/socket";
import { User } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const userLogin = async (userId: string, socketId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("mors-voting-system")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

  const c = await cookies();
  c.set("user_token", jwt);

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      socketId,
    },
    include: {
      currentVote: true,
    },
  });

  console.log("Broadcasting user:logon", updatedUser);

  getSocketService().broadcastToAll("user:logon", updatedUser);

  const socket = getSocketService().getSocket(socketId);
  if (!user) return;
  socket.join(userId);
};

export async function validateUser(throwError?: true): Promise<User>;
export async function validateUser(throwError: false): Promise<User | false>;
export async function validateUser(throwError = true) {
  const c = await cookies();
  const jwt = c.get("user_token");

  if (!jwt) {
    if (throwError) {
      throw new Error("Not authenticated");
    }
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      jwt.value,
      new TextEncoder().encode(process.env.JWT_SECRET as string)
    );
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId as string,
      },
    });

    if (!user) {
      if (throwError) {
        throw new Error("User not found");
      }
      return false;
    }

    return user;
  } catch (error) {
    if (throwError) {
      throw new Error("Invalid token");
    }
    return false;
  }
}

export const userLogout = async () => {
  const user = await validateUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const c = await cookies();
  c.delete("user_token");

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      socketId: null,
    },
    include: {
      currentVote: true,
    },
  });
  getSocketService().broadcastToAll("user:logoff", updatedUser);
  return updatedUser;
};
