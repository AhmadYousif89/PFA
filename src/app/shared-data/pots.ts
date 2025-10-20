import "server-only";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import connectToDatabase from "@/lib/db";
import { auth } from "../(auth)/_lib/auth";
import { Pot, PotDocument } from "@/lib/types";
import { getScopedUserId } from "@/app/shared-data/scope-userId";

const _cachedPots = async (userId: string | ObjectId, limit: number) => {
  const { db } = await connectToDatabase();
  const pots = await db
    .collection<PotDocument>("pots")
    .find({ userId })
    .limit(limit)
    .sort({ createdAt: -1 })
    .toArray();

  if (!pots || pots.length === 0) return [];

  return pots.map((pot) => ({
    id: pot._id.toString(),
    userId: pot.userId?.toString(),
    name: pot.name,
    total: pot.total,
    target: pot.target,
    theme: pot.theme,
  })) satisfies Pot[];
};

/**
 * Fetches all pots for the current user, with an optional limit on the number of pots returned.
 * @param param0
 * @returns All pots for the current user
 */
export async function getPots({ limit = 0 }: { limit?: number } = {}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return [];

  return _cachedPots(userId, limit);
}

/**
 * Fetches the themes of all pots for the current user.
 * @returns An array of pot themes for the current user
 */
export async function getPotsThemes() {
  const pots = await getPots();
  return pots.map((pot) => pot.theme);
}

/**
 * @param pots - An array of pots to calculate the total for
 * @returns The total amount across all pots
 */
export function calcTotalPots(pots: Pot[]) {
  return pots.reduce((total, pot) => total + (pot.total || 0), 0);
}

/**
 * @returns The total number of pots for the current user
 */
export async function getPotsCount() {
  const pots = await getPots();
  return pots.length;
}
