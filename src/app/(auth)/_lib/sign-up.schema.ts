import z from "zod";
import { FieldProps } from "./types";

export const FIELDS: FieldProps[] = [
  { label: "Name", type: "text", name: "name" },
  { label: "Email", type: "email", name: "email" },
  {
    label: "Create Password",
    type: "password",
    name: "password",
    hint: "Passwords must be at least 8 characters",
  },
];

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be at most 30 characters"),
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .min(8, "Passwords must be at least 8 characters")
    .max(30, "Password must be at most 30 characters"),
});

export type SignUpData = z.infer<typeof SignUpSchema>;
