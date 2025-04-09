"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const adminLogin = async (password: string) => {
  const hash = await prisma.settings.findFirst({
    where: {
      name: "adminPassword",
    },
  });

  if (!hash) {
    throw new Error("Admin password not set");
  }

  const isValid = await bcrypt.compare(password, hash.value);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  const jwt = await new SignJWT({ admin: true, userId: null })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("mors-voting-system")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

  const c = await cookies();
  c.set("admin_jwt", jwt);
};

export const validateAdmin = async (
  throwError: boolean = true
): Promise<boolean> => {
  const c = await cookies();
  const jwt = c.get("admin_jwt");

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
    return !!payload.admin;
  } catch (error) {
    if (throwError) {
      throw new Error("Invalid token");
    }
    return false;
  }
};
