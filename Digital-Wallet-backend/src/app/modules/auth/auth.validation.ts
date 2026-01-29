import { z } from "zod";


export const loginZodSchema = z.object({
  email: z
    .string({ message: "Email must be a string" })
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
});

export const recoveryPassZodSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
});