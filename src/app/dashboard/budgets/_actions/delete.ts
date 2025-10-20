"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import connectToDatabase from "@/lib/db";
import { BudgetDocument } from "@/lib/types";
import { auth } from "@/app/(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";

export async function deleteBudgetAction(prevState: unknown, budgetId: string) {
  if (!budgetId) throw new Error("Missing budget ID");
  if (!ObjectId.isValid(budgetId)) throw new Error("Invalid budget ID format");

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = await getScopedUserId(session?.user.id);
    if (!userId) throw new Error("Unauthorized");

    const { db } = await connectToDatabase();
    const collection = db.collection<BudgetDocument>("budgets");
    const result = await collection.deleteOne({ userId, _id: new ObjectId(budgetId) });

    if (!result.acknowledged) {
      throw new Error("Budget not found or already deleted");
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Budget deleted successfully" };
  } catch (error) {
    console.error("Delete budget action failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
