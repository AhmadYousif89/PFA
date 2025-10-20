"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import connectToDatabase from "@/lib/db";
import { auth } from "@/app/(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";
import { BalanceDocument, PotDocument } from "@/lib/types";

export async function deletePotAction(prevState: unknown, potId: string) {
  if (!potId) throw new Error("Missing pot ID");
  if (!ObjectId.isValid(potId)) throw new Error("Invalid pot ID format");

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = await getScopedUserId(session?.user.id);
    if (!userId) throw new Error("Unauthorized");

    const { db } = await connectToDatabase();
    const poCol = db.collection<PotDocument>("pots");
    const balancesCol = db.collection<BalanceDocument>("balances");

    try {
      const pot = await poCol.findOneAndDelete({ userId, _id: new ObjectId(potId) });
      if (!pot) {
        throw new Error("Failed to delete pot");
      }

      const potTotal = pot.total || 0;
      if (potTotal > 0) {
        const balanceRes = await balancesCol.updateOne({ userId }, { $inc: { current: potTotal } });
        if (balanceRes.modifiedCount !== 1) {
          // Rollback pot deletion if balance update fails
          await poCol.insertOne(pot);
          throw new Error("Failed to update balance with pot total");
        }
      }
    } catch (error) {
      console.error("Transaction error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Transaction failed",
      };
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Pot deleted successfully" };
  } catch (error) {
    console.error("Delete pot action failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
