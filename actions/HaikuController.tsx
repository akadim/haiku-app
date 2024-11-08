"use server";

import { HaikuSchema, THaikuSchema } from "@/lib/types";
import { Haiku, PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "./userController";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

export const getAuthToken = async () => {
  return cookies().get("ourHaikuApp")?.value;
};

export const formDataToObject = (formData: FormData) => {
  const object: Record<string, any> = {};

  formData.forEach((value, key) => {
    // Handle special cases
    if (value instanceof File) {
      object[key] = value;
    }
    // Handle checkbox inputs
    else if (value === "on" || value === "off") {
      object[key] = value === "on";
    }
    // Handle number inputs
    else if (!isNaN(Number(value))) {
      object[key] = Number(value);
    }
    // Default to string
    else {
      object[key] = value;
    }
  });

  return object;
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
      photo: validatedHaiku.data.photo,
    },
    include: {
      user: true,
    },
  });

  if (createdHaiku.id) {
    prisma.$disconnect();
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

  const userHaikus = currentUser?.haikus;

  prisma.$disconnect();

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

  prisma.$disconnect();
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

  prisma.$disconnect();
  revalidatePath("/");
  redirect("/");
};

export const deleteHaiku = async (formData: FormData) => {
  const prisma = new PrismaClient();
  const deletedHaiku = await prisma.haiku.delete({
    where: {
      id: formData.get("haikuId") as string,
    },
  });

  prisma.$disconnect();
  revalidatePath("/");
  redirect("/");
};
