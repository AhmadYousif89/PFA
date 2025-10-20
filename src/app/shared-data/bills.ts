import "server-only";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import connectToDatabase from "@/lib/db";
import { auth } from "../(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";
import { getCycleBoundsFromDueDay, nextMonthlyDue, parseNow } from "../dashboard/utils";
import {
  Bill,
  Transaction,
  TransactionCategory,
  TransactionDocument,
  TransactionWithPaymentStatus,
} from "@/lib/types";

type RecurringBillGroup = {
  name: string;
  lastPayment: Date;
  lastAmount: number;
  avgAmount: number;
};

const CATEGORY_BILLS: TransactionCategory = "bills";
const DEFAULT_WINDOW_DAYS = 7;

const addDateStage = { $addFields: { dateAsDate: { $dateFromString: { dateString: "$date" } } } };

const _cachedRecurringBills = async (userId: string | ObjectId) => getRecurringBills(userId);

const _cachedBillsSummary = async (userId: string | ObjectId, now: Date) => {
  const summaryBillTitles = ["Paid Bills", "Total Upcoming", "Due Soon"] as const;

  const [paid, upcoming, due] = await Promise.all([
    calcTotalPaidBills(userId, now),
    calcTotalUpcomingBills(userId, now),
    calcTotalDueBills(userId, now),
  ]);

  return summaryBillTitles.map((name, i) => {
    const amount = i === 0 ? paid : i === 1 ? upcoming : due;
    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      amount,
      theme: i === 0 ? "var(--color-green)" : i === 1 ? "var(--color-yellow)" : "var(--color-cyan)",
    } as Bill;
  });
};

const computeBillFlags = async (
  userId: string | ObjectId,
  now: Date,
  windowDays = DEFAULT_WINDOW_DAYS,
) => {
  const snapshot = new Date(now);
  const groups = await _cachedRecurringBills(userId); // { name, lastPayment, avgAmount }[]

  const dueSoon = new Set<string>();
  const overdue = new Set<string>();
  const paidThisCycle = new Set<string>();
  const dueDayMap: Record<string, number> = {};

  const end = new Date(now);
  end.setUTCDate(now.getUTCDate() + windowDays);

  for (const g of groups) {
    const last = new Date(g.lastPayment);
    const dueDay = last.getUTCDate(); // Use UTC day to avoid midnight TZ differences
    const { cycleStart, nextDue } = getCycleBoundsFromDueDay(dueDay, now);

    dueDayMap[g.name] = nextMonthlyDue(g.lastPayment).getUTCDate();
    // Paid only if last payment happened within the current cycle window
    const isPaid = last >= cycleStart && last < nextDue;
    if (isPaid) {
      paidThisCycle.add(g.name);
      continue;
    }
    // Only unpaid bills get dueSoon/overdue flags
    if (nextDue < snapshot) {
      overdue.add(g.name);
    } else if (nextDue <= end) {
      dueSoon.add(g.name);
    }
  }

  return {
    // sort for stable results (nice for caching/diffs)
    dueSoon: Array.from(dueSoon).sort(),
    overdue: Array.from(overdue).sort(),
    paidThisCycle: Array.from(paidThisCycle).sort(),
    dueDayMap,
  };
};

/**
 * Get all unique bill names that are unpaid and due within the next `windowDays` days
 * @param nowIso - optional ISO date string to use as "now" instead of current date
 * @returns Array of unique bill names
 */
export async function getBillsSummary(nowIso?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return [] as Bill[];

  return _cachedBillsSummary(userId, parseNow(nowIso));
}

/**
 * Get count of all paid bills (unique, paid this cycle)
 * @param nowIso - optional ISO date string to use as "now" instead of current date
 * @returns Number of unique paid bills
 */
export async function getPaidBillsCount(nowIso?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const { paidThisCycle } = await computeBillFlags(userId, parseNow(nowIso));
  return paidThisCycle.length;
}

/**
 * Get count of all upcoming bills (unique, unpaid, not due soon/overdue)
 * @param nowIso - optional ISO date string to use as "now" instead of current date
 * @returns Number of unique upcoming bills
 */
export async function getUpcomingBillsCount(nowIso?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const names = await getUpcomingUnpaidBillNames(userId, parseNow(nowIso));
  return names.length;
}

/**
 * Get count of all due bills (unique, unpaid, due soon or overdue)
 * @param nowIso - optional ISO date string to use as "now" instead of current date
 * @returns Number of unique due bills
 */
export async function getDueBillsCount(nowIso?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const names = await getDueBillNames(userId, parseNow(nowIso));
  return names.length;
}

/**
 * @param nowIso - optional ISO date string to use as "now" instead of current date
 * @returns All bill transactions with payment status flags (paid, due soon, overdue)
 */
export async function getBillTransactionsWithPaymentStatus(
  nowIso?: string,
): Promise<TransactionWithPaymentStatus[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return [];

  const now = parseNow(nowIso);
  const [base, flags] = await Promise.all([
    getBillTransactions(userId),
    computeBillFlags(userId, now),
  ]);

  const dueSoonSet = new Set(flags.dueSoon);
  const overdueSet = new Set(flags.overdue);
  const paidCycleSet = new Set(flags.paidThisCycle);

  return base.map((t) => ({
    ...t,
    paid: paidCycleSet.has(t.name),
    dueSoon: dueSoonSet.has(t.name),
    overdue: overdueSet.has(t.name),
    dueDay: flags.dueDayMap[t.name],
  }));
}

/**
 * @param userId - The user ID to get recurring bills for
 * @returns All recurring bills (unique names) for the given user ID
 */
async function getRecurringBills(userId: string | ObjectId): Promise<RecurringBillGroup[]> {
  const { db } = await connectToDatabase();
  const docs = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<RecurringBillGroup>([
      addDateStage,
      { $match: { userId, category: CATEGORY_BILLS, recurring: true, amount: { $lt: 0 } } },
      { $sort: { dateAsDate: -1 } },
      {
        $group: {
          _id: "$name",
          lastPayment: { $first: "$dateAsDate" },
          lastAmount: { $first: { $abs: "$amount" } },
          avgAmount: { $avg: { $abs: "$amount" } },
        },
      },
      { $project: { _id: 0, name: "$_id", lastPayment: 1, lastAmount: 1, avgAmount: 1 } },
    ])
    .toArray();

  return docs;
}

/**
 * @param userId - The user ID to calculate paid bills for
 * @param now - current date
 * @returns Total amount of all paid bills (last payment in current cycle)
 */
async function calcTotalPaidBills(userId: string | ObjectId, now: Date) {
  const { paidThisCycle } = await computeBillFlags(userId, now);
  if (paidThisCycle.length === 0) return 0;

  const groups = await _cachedRecurringBills(userId);
  const paidSet = new Set(paidThisCycle);
  let total = 0;
  for (const g of groups) {
    if (paidSet.has(g.name)) {
      total += g.lastAmount ?? g.avgAmount ?? 0;
    }
  }
  return total;
}

/**
 * @param userId - The user ID to calculate upcoming bills for
 * @param now - current date
 * @returns Total amount of all upcoming bills (unpaid, > 7 days out)
 */
async function calcTotalUpcomingBills(userId: string | ObjectId, now: Date) {
  const [groups, names] = await Promise.all([
    _cachedRecurringBills(userId),
    getUpcomingUnpaidBillNames(userId, now),
  ]);
  const upcoming = new Set(names);
  let total = 0;
  for (const g of groups) {
    if (upcoming.has(g.name)) total += g.avgAmount;
  }
  return total;
}

/**
 * @param userId - The user ID to calculate due bills for
 * @param now - current date
 * @returns Total amount of all due bills (unpaid, due soon or overdue)
 */
async function calcTotalDueBills(userId: string | ObjectId, now: Date) {
  const [groups, names] = await Promise.all([
    _cachedRecurringBills(userId),
    getDueBillNames(userId, now),
  ]);
  const target = new Set(names);
  let total = 0;
  for (const g of groups) {
    if (target.has(g.name)) total += g.avgAmount;
  }
  return total;
}

/**
 * Get all due bill names that are unpaid and due soon or overdue
 * @param userId - The user ID to get due bills for
 * @param now - current date
 * @returns Array of unique due bill names
 */
async function getDueBillNames(userId: string | ObjectId, now: Date) {
  const { dueSoon, overdue, paidThisCycle } = await computeBillFlags(userId, now);
  const paid = new Set(paidThisCycle);
  return Array.from(new Set([...dueSoon, ...overdue].filter((n) => !paid.has(n))));
}

/**
 * Get all bill transactions for the given user ID
 * @param userId - The user ID to get bill transactions for
 * @returns Array of bill transactions
 */
async function getBillTransactions(userId: string | ObjectId) {
  const { db } = await connectToDatabase();
  const transactions = await db
    .collection<TransactionDocument>("transactions")
    .find({ userId, category: CATEGORY_BILLS })
    .sort({ date: -1 })
    .toArray();

  return transactions.map((t) => ({
    id: t._id.toString(),
    name: t.name,
    date: t.date,
    avatar: t.avatar,
    category: t.category,
    amount: Number(t.amount),
    recurring: t.recurring,
  })) satisfies Transaction[];
}

/**
 * Get all unique bill names that are unpaid and due within the next `windowDays` days
 * @param userId - The user ID to get upcoming bills for
 * @param now - current date
 * @returns Array of unique bill names
 */
async function getUpcomingUnpaidBillNames(userId: string | ObjectId, now: Date) {
  const [summary, flags] = await Promise.all([
    _cachedRecurringBills(userId),
    computeBillFlags(userId, now),
  ]);
  const allBillNames = Array.from(new Set(summary.map((b) => b.name)));
  const paidThisCycle = new Set(flags.paidThisCycle);
  const blocked = new Set([...flags.dueSoon, ...flags.overdue]);

  const result: string[] = [];
  for (const name of allBillNames) {
    if (!paidThisCycle.has(name) && !blocked.has(name)) result.push(name);
  }
  return result;
}

/**
 * @returns Count of all unique recurring bills for the current user
 */
export async function getRecurringBillsCount() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return 0;

  const groups = await _cachedRecurringBills(userId);
  return groups.length;
}
