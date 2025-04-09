"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { validateAdmin } from "./admin";

export const validateVoteKey = async (throwError = true) => {
  const c = await cookies();
  const userVoteKey = c.get("voteKey");
  if (!userVoteKey) {
    if (throwError) {
      throw new Error("Vote key not found");
    }
    return false;
  }
  const voteKeyValue = userVoteKey.value;

  const serverVoteKey = await prisma.settings.findFirst({
    where: {
      name: "voteKey",
    },
  });
  if (!serverVoteKey) {
    if (throwError) {
      throw new Error("Vote key not found");
    }
    return false;
  }

  if (serverVoteKey.value !== voteKeyValue) {
    if (throwError) {
      throw new Error("Vote key not found");
    }
    return false;
  }

  return true;
};

export const getVoteKey = async () => {
  await validateVoteKey();

  const key = await prisma.settings.findFirst({
    where: {
      name: "voteKey",
    },
  });

  if (!key) {
    throw new Error("Vote key not found");
  }

  return key.value;
};

export const adminGetVoteKey = async () => {
  await validateAdmin();
  const key = await prisma.settings.findFirst({
    where: {
      name: "voteKey",
    },
  });

  if (!key) {
    throw new Error("Vote key not found");
  }

  return key.value;
};

export const setVoteKey = async (key: string) => {
  await validateAdmin();

  const voteKey = await prisma.settings.findFirst({
    where: {
      name: "voteKey",
    },
  });

  if (!voteKey) {
    await prisma.settings.create({
      data: {
        name: "voteKey",
        value: key,
      },
    });
  } else {
    await prisma.settings.update({
      where: {
        id: voteKey.id,
      },
      data: {
        value: key,
      },
    });
  }
};
