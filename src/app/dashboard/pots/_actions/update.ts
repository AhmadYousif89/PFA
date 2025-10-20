"use server";

import { z } from "zod";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import connectToDatabase from "@/lib/db";
import { auth } from "@/app/(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";
import { themeColors } from "@/lib/config";
import { PotDocument, ThemeColor } from "@/lib/types";

const schema = z.object({
  name: z
    .string()
    .regex(/^\S.*$/, { message: "Pot name cannot start with a space" })
    .max(30, { message: "Pot name must be 30 characters or less" })
    .refine((val) => val.trim() && val.length > 0, { message: "Pot name cannot be empty" })
    .nullable(),
  target: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { error: "Enter a valid amount, like 2000 or 2000.00" })
    .transform((val) => parseFloat(val)),
  theme: z.string({ error: "Invalid theme selected" }).nullable(),
});

export async function editPotAction(prevState: unknown, formData: FormData) {
  const potId = formData.get("pot-id") as string;

  if (!potId) throw new Error("Missing pot ID");
  if (!ObjectId.isValid(potId)) throw new Error("Invalid pot ID format");

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

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = await getScopedUserId(session?.user.id);
    if (!userId) throw new Error("Unauthorized");

    const { db } = await connectToDatabase();
    const collection = db.collection<PotDocument>("pots");
    const existingPot = await collection.findOne({ userId, _id: new ObjectId(potId) });

    if (!existingPot) throw new Error("Pot not found");

    const newTarget = data.target;
    if (newTarget != undefined && newTarget < existingPot.total) {
      throw new Error(
        `Target amount cannot be less than the current pot total of ${existingPot.total.toFixed(2)}`,
      );
    }

    const theme = themeColors[data.theme as keyof typeof themeColors];
    const updatedPot = {
      name: data.name ?? existingPot.name,
      target: data.target ?? existingPot.target,
      theme: theme ?? existingPot.theme,
    };

    const hasChanges =
      existingPot.name !== updatedPot.name ||
      existingPot.target !== updatedPot.target ||
      existingPot.theme !== updatedPot.theme;

    if (!hasChanges) {
      return { success: true, message: "No changes made to the pot" };
    }

    const result = await collection.updateOne(
      { userId, _id: new ObjectId(potId) },
      { $set: updatedPot },
    );

    if (!result.acknowledged) {
      throw new Error("Failed to update pot");
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Pot updated successfully" };
  } catch (error) {
    console.error("Edit pot action failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
