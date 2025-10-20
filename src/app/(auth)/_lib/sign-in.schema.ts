import z from "zod";
import { FieldProps } from "./types";

export const FIELDS: FieldProps[] = [
  { label: "Email", type: "email", name: "email" },
  { label: "Password", type: "password", name: "password" },
] as const;

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .min(8, "Password must be at least 8 characters"),
});

export type SignInData = z.infer<typeof SignInSchema>;
