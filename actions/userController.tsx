"use server";

import {
  LoginSchema,
  signupSchema,
  TLoginSchema,
  TSignupSchema,
} from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const encrypt = async (payload: { id: string }) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
};

export const decrypt = async (session: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
};

export const logout = async () => {
  cookies().delete("ourHaikuApp");
  redirect("/");
};

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

export const login = async (data: TLoginSchema) => {
  // Validating the login data
  const result = LoginSchema.safeParse(data);
  const prisma = new PrismaClient();

  if (!result.success) {
    return {
      errors: result.error.issues,
      success: false,
    };
  }

  // Check if the user exists
  const fetchedUser = await prisma.user.findUnique({
    where: {
      username: result.data.username,
    },
  });

  const failedLogin = {
    message: "Invalid username or password",
    success: false,
  };

  if (!fetchedUser) {
    return failedLogin;
  }

  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compareSync(
    result.data.password,
    fetchedUser.password
  );

  if (!isPasswordCorrect) {
    return failedLogin;
  }

  // Create a JWT Token with the user id and store it in the cookie
  cookies().set(
    "ourHaikuApp",
    jwt.sign(
      {
        id: fetchedUser.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        secure: true,
      },
      process.env.JWT_SECRET!
    ),
    {}
  );

  return redirect("/");
};
