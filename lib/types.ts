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

export type TSignupSchema = z.infer<typeof signupSchema>;
export type TLoginSchema = z.infer<typeof LoginSchema>;
