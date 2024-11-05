"use server";

import { HaikuSchema, THaikuSchema } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "./userController";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

export const getAuthToken = async () => {
  return cookies().get("ourHaikuApp")?.value;
};

export const createHaiku = async (data: THaikuSchema) => {
  const validatedHaiku = HaikuSchema.safeParse(data);
  const prisma = new PrismaClient();
  const loggedInUser = await decrypt(cookies().get("ourHaikuApp")?.value);

  if (!validatedHaiku.success) {
    return {
      success: false,
      errors: validatedHaiku.error.issues,
    };
  }

  const createdHaiku = await prisma.haiku.create({
    data: {
      line1: validatedHaiku.data.line1,
      line2: validatedHaiku.data.line2,
      line3: validatedHaiku.data.line3,
      user: {
        connect: {
          id: loggedInUser!.id as string,
        },
      },
    },
    include: {
      user: true,
    },
  });

  if (createdHaiku.id) {
    revalidatePath("/");
    redirect("/");
  }
};

export const getHaikus = async (token: string) => {
  const prisma = new PrismaClient();
  const loggedInUser = await decrypt(token);

  const currentUser = await prisma.user.findUnique({
    where: {
      id: loggedInUser!.id as string,
    },
    include: {
      haikus: true,
    },
  });

  console.log("User Haikus ========== ", currentUser);

  const userHaikus = currentUser?.haikus;

  return userHaikus;
};

export const getCachedHaikies = unstable_cache(
  async (loggedInUserToken) => getHaikus(loggedInUserToken),
  ["haikus"]
);

export const getHaiku = async (id: string) => {
  const prisma = new PrismaClient();
  const haiku = await prisma.haiku.findUnique({
    where: {
      id: id,
    },
  });

  if (!haiku) {
    return null;
  }

  return haiku;
};

export const getCachedHaiku = unstable_cache(
  (haikuId) => getHaiku(haikuId),
  ["haiku"]
);

export const updateHaiku = async (id: string, data: THaikuSchema) => {
  const prisma = new PrismaClient();

  const updatedHaiku = await prisma.haiku.update({
    where: {
      id,
    },
    data: {
      line1: data.line1,
      line2: data.line2,
      line3: data.line3,
    },
  });

  revalidatePath("/");
  redirect("/");
};
