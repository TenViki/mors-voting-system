"use server";

import prisma from "@/lib/prisma";
import { validateAdmin } from "./admin";

export const getUsers = async () => {
  const users = await prisma.user.findMany();

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
