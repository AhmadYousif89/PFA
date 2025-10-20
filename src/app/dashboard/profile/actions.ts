"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { auth } from "@/app/(auth)/_lib/auth";

const nameSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(30, "Name is too long"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters long"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .max(30, "New password is too long"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function updateUserName(prevState: unknown, formData: FormData) {
  const { success, data, error } = nameSchema.safeParse({
    name: formData.get("name"),
  });

  try {
    if (!success) {
      throw new Error(error.issues.map((e) => e.message).join(", "));
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      throw new Error("User is not authenticated");
    }

    const exUserName = session.user.name || "";
    if (data.name === exUserName) {
      return { success: true, error: null, message: "No changes made" };
    }

    const updatedUser = await auth.api.updateUser({
      body: { name: data.name },
      headers: await headers(),
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return { success: true, error: null, message: "Name updated successfully" };
  } catch (error) {
    console.log("Error updating user profile:", error);
    return { success: false, error: (error as Error).message };
  }
}

export type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";
export type FieldError = { path: PasswordField; message: string };

export async function updateUserPassword(prevState: unknown, formData: FormData) {
  const { success, data, error } = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  try {
    if (!success) {
      const errors: FieldError[] = error.issues.map((issue) => ({
        path: (issue.path?.[0] as PasswordField) ?? "currentPassword",
        message: issue.message,
      }));
      return { success: false, message: null, errors };
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return {
        success: false,
        message: null,
        errors: [{ path: "currentPassword", message: "User is not authenticated" }],
      };
    }

    await auth.api.changePassword({
      body: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });

    return { success: true, message: "Password updated successfully", errors: [] };
  } catch (err) {
    const msg = (err as Error).message || "Failed to update password";
    // Attach unknown errors to currentPassword by default
    return {
      success: false,
      message: null,
      errors: [{ path: "currentPassword", message: msg }],
    };
  }
}
