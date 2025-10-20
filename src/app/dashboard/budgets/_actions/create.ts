"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { auth } from "@/app/(auth)/_lib/auth";
import { themeColors, budgetCategories } from "@/lib/config";
import { BudgetDocument, ThemeColor, TransactionCategory } from "@/lib/types";
import { getScopedUserId } from "@/app/shared-data/scope-userId";

const schema = z.object({
  category: z.enum(budgetCategories, { error: "Invalid category selected" }),
  maximum: z
    .string()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      error: "Enter a valid amount, like 2000 or 2000.00",
    })
    .transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) {
        throw new Error("Maximum must be a positive number");
      }
      return num;
    }),
  theme: z.string({ error: "Invalid theme selected" }),
});

export async function createBudgetAction(prevState: unknown, formData: FormData) {
  const rawData = {
    category: formData.get("category") as TransactionCategory,
    maximum: formData.get("maximum") as string,
    theme: formData.get("theme") as ThemeColor,
  };

  try {
    const { success, data, error } = schema.safeParse(rawData);
    if (!success) {
      throw new Error(error.issues.map((err) => err.message).join(", ") || "Validation failed");
    }

    const theme = themeColors[data.theme as keyof typeof themeColors];
    const newBudget = {
      category: data.category,
      maximum: data.maximum,
      theme,
      createdAt: new Date(),
    };

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = await getScopedUserId(session?.user.id);
    if (!userId) throw new Error("Unauthorized");

    const { db } = await connectToDatabase();
    const col = db.collection<BudgetDocument>("budgets");
    const result = await col.insertOne({ ...newBudget, userId });

    if (!result.acknowledged) {
      throw new Error("Failed to create new budget");
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Budget created successfully" };
  } catch (error) {
    console.error("Create budget action failed:", error);
    // Handle duplicate key error (e.g., unique index violation)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return { success: false, message: "You already have a budget for this category." };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
