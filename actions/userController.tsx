"use server";

import { signupSchema, TSignupSchema } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const signup = async (data: TSignupSchema) => {
  const prisma = new PrismaClient();

  // Validate if the user with the same username already exists
  const uniqueUsernameSchema = signupSchema.superRefine(async (data, ctx) => {
    const isUsernameTaken = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (isUsernameTaken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username already taken",
        path: ["username"],
      });
    }
  });

  const result = await uniqueUsernameSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      errors: result.error.issues,
      success: false,
    };
  }

  // Add the User to the database
  const salt = bcrypt.genSaltSync(10);

  const newUser = await prisma.user.create({
    data: {
      username: result.data.username,
      password: await bcrypt.hash(result.data.password, salt),
    },
  });

  prisma.$disconnect();

  // login the user in by giving them a cookie

  // create our JWT value
  const ourTokenValue = jwt.sign(
    { id: newUser.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    process.env.JWT_SECRET!
  );
  cookies().set("ourHaikuApp", ourTokenValue, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    secure: true,
  });

  return result;
};
