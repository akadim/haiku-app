"use server";

import { HaikuSchema, THaikuSchema } from "@/lib/types";
import { Haiku, PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "./userController";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

export const getAuthToken = async () => {
  return (await cookies()).get("ourHaikuApp")?.value;
};

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const createHaiku = async (data: THaikuSchema) => {
  const validatedHaiku = HaikuSchema.safeParse(data);
  const prisma = new PrismaClient();
  const loggedInUser = await decrypt(
    (await cookies()).get("ourHaikuApp")?.value
  );

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
  async (haikuId) => getHaiku(haikuId),
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
      photo: data.photo,
    },
  });

  prisma.$disconnect();
  revalidatePath("/");
  redirect("/");
};

export const deleteHaiku = async (haikuId: string) => {
  const prisma = new PrismaClient();

  const deletedHaiku = await prisma.haiku.delete({
    where: {
      id: haikuId,
    },
  });

  const result = await cloudinary.uploader.destroy(deletedHaiku.photo);

  prisma.$disconnect();
  revalidatePath("/");
  redirect("/");
};
