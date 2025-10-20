"use server";

import { z } from "zod";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { auth } from "@/app/(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";
import { themeColors, budgetCategories } from "@/lib/config";
import { BudgetDocument, ThemeColor, TransactionCategory } from "@/lib/types";

const schema = z.object({
  category: z
    .enum(budgetCategories, {
      error: "Please select a category that is not already used",
    })
    .nullable(),
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
  theme: z.string({ error: "Invalid theme selected" }).nullable(),
});

export async function editBudgetAction(prevState: unknown, formData: FormData) {
  const budgetId = formData.get("budget-id") as string;

  if (!budgetId) throw new Error("Missing budget ID");
  if (!ObjectId.isValid(budgetId)) throw new Error("Invalid budget ID format");

  const rawData = {
    category: formData.get("category") as TransactionCategory,
    maximum: formData.get("maximum") as string,
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
    const collection = db.collection<BudgetDocument>("budgets");
    const existingBudget = await collection.findOne({ userId, _id: new ObjectId(budgetId) });

    if (!existingBudget) {
      throw new Error("Budget not found");
    }

    const theme = themeColors[data?.theme as keyof typeof themeColors];
    const updatedBudget = {
      category: data?.category ?? existingBudget.category,
      maximum: data?.maximum ?? existingBudget.maximum,
      theme: theme ?? existingBudget.theme,
    };

    const hasChanges =
      existingBudget.category !== updatedBudget.category ||
      existingBudget.maximum !== updatedBudget.maximum ||
      existingBudget.theme !== updatedBudget.theme;

    if (!hasChanges) {
      return { success: true, message: "No changes made to the budget" };
    }

    const result = await collection.updateOne(
      { userId, _id: new ObjectId(budgetId) },
      { $set: updatedBudget },
    );

    if (!result.acknowledged) {
      throw new Error("Failed to update budget");
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Budget updated successfully" };
  } catch (error) {
    console.error("Edit budget action failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
