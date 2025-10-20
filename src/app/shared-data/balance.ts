import "server-only";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/db";
import { auth } from "../(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";
import { BalanceDocument, TransactionDocument } from "@/lib/types";

/**
 * @returns The current balance, total income, and total expenses for the current user
 */
export async function getBalance() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return { current: 0, income: 0, expenses: 0 };

  const { db } = await connectToDatabase();
  const balance = await db.collection<BalanceDocument>("balances").findOne({ userId });
  if (!balance) return { current: 0, income: 0, expenses: 0 };

  const { current, income, expenses } = balance;
  return { current, income, expenses };
}

/**
 * @returns The total expenses for a specified month and year
 */
export async function getTotalExpenses() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const { db } = await connectToDatabase();

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ totalExpenses: number }>([
      { $match: { userId, amount: { $lt: 0 } } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: { $abs: "$amount" } },
        },
      },
    ])
    .toArray();

  return result[0]?.totalExpenses || 0;
}

/**
 * Calculates the average monthly income for the current user based on their transaction history
 * and the initial monthly income set during onboarding.
 * @returns The average monthly income for the current user
 */
export async function getAverageMonthlyIncome() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const { db } = await connectToDatabase();

  // Get transaction-based income aggregated by month
  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ avgIncome: number; months: number }>([
      { $match: { userId, amount: { $gt: 0 } } },
      {
        $addFields: {
          dateAsDate: { $dateFromString: { dateString: "$date" } },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateAsDate" },
            month: { $month: "$dateAsDate" },
          },
          monthlyIncome: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: null,
          avgIncome: { $avg: "$monthlyIncome" },
          months: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const transactionData = result[0];

  const baselineIncome = await getBaselineIncome(userId);
  // If no transactions yet, return the baseline income
  if (!transactionData || transactionData.months === 0) {
    return baselineIncome;
  }

  // Calculate weighted average: include baseline income as one data point
  const totalMonths = transactionData.months + 1;
  const weightedAverage =
    (transactionData.avgIncome * transactionData.months + baselineIncome) / totalMonths;

  return weightedAverage;
}

/**
 * Calculates the total expenses for a specified month and year.
 * @param month
 * @param year
 * @returns The total expenses for the specified month and year
 */
export async function calculateMonthlyExpenses(
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const { db } = await connectToDatabase();

  const firstDayOfMonth = new Date(year, month, 1); // Month of January is 0
  const lastDayOfMonth = new Date(year, month + 1, 0); // Last day of the month

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ totalExpenses: number }>([
      {
        $addFields: {
          dateAsDate: { $dateFromString: { dateString: "$date" } },
        },
      },
      {
        $match: {
          userId,
          dateAsDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
          amount: { $lt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: { $abs: "$amount" } },
        },
      },
    ])
    .toArray();

  return result[0]?.totalExpenses || 0;
}

/**
 * Calculates the total income for a specified month and year.
 * Includes baseline income from onboarding if no income transactions exist for the month.
 * @param month
 * @param year
 * @returns The total income for the specified month and year
 */
export async function calculateMonthlyIncome(
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const { db } = await connectToDatabase();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ totalIncome: number }>([
      {
        $addFields: {
          dateAsDate: { $dateFromString: { dateString: "$date" } },
        },
      },
      {
        $match: {
          userId,
          dateAsDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
          amount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ])
    .toArray();

  const transactionIncome = result[0]?.totalIncome || 0;

  // If no income transactions for this month, consider baseline income
  if (transactionIncome === 0) {
    return await getBaselineIncome(userId);
  }

  return transactionIncome;
}

/**
 * @returns The updated balance after recalculating based on transactions
 */
export async function updateBalance() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const { db } = await connectToDatabase();

  const result = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ totalBalance: number }>([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$amount" },
        },
      },
    ])
    .toArray();

  const newBalance = result[0]?.totalBalance || 0;

  await db
    .collection<BalanceDocument>("balances")
    .updateOne({ userId }, { $set: { current: newBalance } }, { upsert: true });

  return newBalance;
}

async function getBaselineIncome(userId: string | ObjectId) {
  const { db } = await connectToDatabase();
  const balance = await db.collection<BalanceDocument>("balances").findOne({ userId });
  return balance?.income || 0;
}
