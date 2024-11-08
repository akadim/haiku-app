import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(10, "Password must be at least 10 characters"),
    "confirm-password": z
      .string()
      .min(10, "Password must be at least 10 characters"),
  })
  .refine((data) => data.password === data["confirm-password"], {
    message: "Passwords do not match",
    path: ["confirm-password"],
  });

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(10, "Password must be at least 10 characters"),
});

export const HaikuSchema = z.object({
  line1: z.string().min(1, "Line 1 is required"),
  line2: z.string().min(1, "Line 2 is required"),
  line3: z.string().min(1, "Line 3 is required"),
  photo: z.string().min(1, "Photo is required"),
  version: z.string().min(1, "Version is required"),
  signature: z.string().min(1, "Signature is required"),
});

export type TSignupSchema = z.infer<typeof signupSchema>;
export type TLoginSchema = z.infer<typeof LoginSchema>;
export type THaikuSchema = z.infer<typeof HaikuSchema>;
