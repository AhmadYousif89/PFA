"use server";

import { z } from "zod";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import connectToDatabase from "@/lib/db";
import { auth } from "../(auth)/_lib/auth";

const onboardingSchema = z.object({
  current: z
    .string()
    .min(1, "Current balance is required")
    .refine((val) => !isNaN(parseFloat(val)), "Balance must be a valid number")
    .refine((val) => parseFloat(val) >= 0, "Balance must be positive")
    .transform((val) => parseFloat(val.trim())),
  income: z
    .string()
    .min(1, "Monthly income is required")
    .refine((val) => !isNaN(parseFloat(val)), "Income must be a valid number")
    .refine((val) => parseFloat(val) >= 0, "Income must be positive")
    .transform((val) => parseFloat(val.trim())),
});

export async function initializeUserBalance(prevState: unknown, formData: FormData) {
  const rawData = {
    current: formData.get("current"),
    income: formData.get("income"),
  };

  try {
    const { success, error, data } = onboardingSchema.safeParse(rawData);
    if (!success) {
      const msg = error.issues[0].message;
      const path = error.issues[0].path[0];
      return {
        error: {
          current: path === "current" ? msg : undefined,
          income: path === "income" ? msg : undefined,
        },
        success: false,
        message: "Validation failed",
      };
    }

    const { current, income } = data;
    const { db } = await connectToDatabase();
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id ? new ObjectId(session.user.id) : null;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const balanceRes = await db
      .collection("balances")
      .updateOne({ userId }, { $set: { current, income, expenses: 0 } }, { upsert: true });

    if (!balanceRes.acknowledged) {
      throw new Error("Failed to initialize user balance");
    }

    await auth.api.updateUser({ body: { hasFinalized: true }, headers: await headers() });
  } catch (error) {
    console.error("Onboarding action error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      error: { current: "An unexpected error occurred", income: "An unexpected error occurred" },
    };
  }

  redirect("/dashboard");
}
