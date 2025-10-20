"use server";

import { z } from "zod";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import connectToDatabase from "@/lib/db";
import { auth } from "@/app/(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";
import { BalanceDocument, PotDocument } from "@/lib/types";

const schema = z.object({
  withdrawal: z
    .string()
    .trim()
    .min(1, "Withdrawal amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Withdrawal amount must be a valid number")
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, "Withdrawal amount must be greater than 0"),
});

export async function withdrawalFromPotAction(prevState: unknown, formData: FormData) {
  const potId = formData.get("pot-id") as string;

  if (!potId) throw new Error("Missing pot ID");
  if (!ObjectId.isValid(potId)) throw new Error("Invalid pot ID");

  try {
    const rawData = formData.get("withdrawal") as string;
    const parsedData = schema.safeParse({ withdrawal: rawData });

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0].message);
    }

    const withdrawalAmount = parsedData.data.withdrawal;

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = await getScopedUserId(session?.user.id);
    if (!userId) throw new Error("Unauthorized");

    const { db, client } = await connectToDatabase();
    const mongoSession = client.startSession();

    try {
      await mongoSession.withTransaction(async () => {
        const potsCol = db.collection<PotDocument>("pots");
        const balancesCol = db.collection<BalanceDocument>("balances");

        // Decrement pot total only if enough funds available
        const potRes = await potsCol.updateOne(
          {
            userId,
            _id: new ObjectId(potId),
            total: { $gte: withdrawalAmount },
          },
          { $inc: { total: -withdrawalAmount } },
          { session: mongoSession },
        );

        if (potRes.modifiedCount !== 1) {
          throw new Error("Insufficient funds in pot or pot not found");
        }

        // Increment balance current
        const balanceRes = await balancesCol.updateOne(
          { userId },
          { $inc: { current: withdrawalAmount } },
          { session: mongoSession },
        );

        if (balanceRes.modifiedCount !== 1) {
          throw new Error("Failed to update balance");
        }
      });

      revalidatePath("/dashboard");
      return {
        success: true,
        message: `Successfully withdrew ${withdrawalAmount.toFixed(2)} from your pot`,
      };
    } finally {
      await mongoSession.endSession();
    }
  } catch (error) {
    console.error("Withdrawal transaction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
