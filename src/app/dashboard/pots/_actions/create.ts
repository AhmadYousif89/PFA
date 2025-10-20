"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import connectToDatabase from "@/lib/db";
import { auth } from "@/app/(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";
import { themeColors } from "@/lib/config";
import { ThemeColor, PotDocument } from "@/lib/types";

const schema = z.object({
  name: z
    .string()
    .refine((val) => val.trim() !== "", { error: "Name cannot be empty" })
    .max(30, { error: "Name must be 30 characters or less" }),
  target: z
    .string()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      error: "Enter a valid amount, like 2000 or 2000.00",
    })
    .transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) {
        throw new Error("Target must be a positive number");
      }
      return num;
    }),
  theme: z.string({ error: "Invalid theme selected" }),
});

export async function createPotAction(prevState: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    target: formData.get("target") as string,
    theme: formData.get("theme") as ThemeColor,
  };

  try {
    const { success, data, error } = schema.safeParse(rawData);
    if (!success) {
      throw new Error(error.issues.map((err) => err.message)[0] || "Validation failed");
    }

    const theme = themeColors[data.theme as keyof typeof themeColors];
    const newPot = {
      name: data.name,
      target: data.target,
      total: 0,
      theme,
      createdAt: new Date(),
    };

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = await getScopedUserId(session?.user.id);
    if (!userId) throw new Error("Unauthorized");

    const { db } = await connectToDatabase();
    const collection = db.collection<PotDocument>("pots");
    const result = await collection.insertOne({ ...newPot, userId });

    if (!result.acknowledged) {
      throw new Error("Failed to create new pot");
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Pot created successfully" };
  } catch (error) {
    console.error("Error creating pot:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
