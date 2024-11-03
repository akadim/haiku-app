"use server";

import { HaikuSchema, THaikuSchema } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "./userController";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

const loggedInUserToken = cookies().get("ourHaikuApp")?.value;

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

export const getHaikus = unstable_cache(async () => {
  const prisma = new PrismaClient();
  const loggedInUser = await decrypt(loggedInUserToken);

  const currentUser = await prisma.user.findUnique({
    where: {
      id: loggedInUser!.id as string,
    },
    include: {
      haikus: true,
    },
  });

  const userHaikus = currentUser?.haikus;

  return userHaikus;
}, ["haikus"]);
