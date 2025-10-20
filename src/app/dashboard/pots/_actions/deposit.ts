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
  deposit: z
    .string()
    .min(1, "Deposit amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Deposit amount must be a valid number")
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, "Deposit amount must be greater than 0"),
});

export async function depositToPotAction(prevState: unknown, formData: FormData) {
  const potId = formData.get("pot-id") as string;

  if (!potId) throw new Error("Missing pot ID");
  if (!ObjectId.isValid(potId)) throw new Error("Invalid pot ID");

  try {
    const rawDeposit = formData.get("deposit") as string;
    const parsedDeposit = schema.safeParse({ deposit: rawDeposit });

    if (!parsedDeposit.success) {
      throw new Error(parsedDeposit.error.issues[0].message);
    }

    const depositAmount = parsedDeposit.data.deposit;

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = await getScopedUserId(session?.user.id);
    if (!userId) throw new Error("Unauthorized");

    const { db, client } = await connectToDatabase();
    const mongoSession = client.startSession();

    try {
      await mongoSession.withTransaction(async () => {
        const potsCol = db.collection<PotDocument>("pots");
        const balancesCol = db.collection<BalanceDocument>("balances");

        // Decrement balance.current only if enough funds
        const decRes = await balancesCol.updateOne(
          { userId, current: { $gte: depositAmount } },
          { $inc: { current: -depositAmount } },
          { session: mongoSession },
        );

        if (decRes.modifiedCount !== 1) {
          throw new Error("Insufficient funds in balance");
        }

        // Increment pot total and adjust target if needed
        const potRes = await potsCol.updateOne(
          { userId, _id: new ObjectId(potId) },
          [
            {
              $set: {
                total: { $add: [{ $ifNull: ["$total", 0] }, depositAmount] },
                target: {
                  $let: {
                    vars: {
                      newTotal: { $add: [{ $ifNull: ["$total", 0] }, depositAmount] },
                      currentTarget: { $ifNull: ["$target", 0] },
                    },
                    in: {
                      $cond: [
                        { $gt: ["$$newTotal", "$$currentTarget"] },
                        "$$newTotal",
                        "$$currentTarget",
                      ],
                    },
                  },
                },
              },
            },
          ],
          { session: mongoSession },
        );

        if (potRes.modifiedCount !== 1) {
          throw new Error("Failed to deposit to pot - pot not found");
        }
      });

      revalidatePath("/dashboard");
      return {
        success: true,
        message: `Successfully deposited ${depositAmount.toFixed(2)} to your pot`,
      };
    } finally {
      await mongoSession.endSession();
    }
  } catch (error) {
    console.error("Deposit transaction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
