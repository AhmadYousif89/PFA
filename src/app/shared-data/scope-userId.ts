import "server-only";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export const DEMO_USER_ID = new ObjectId("68e80815a62942e0502ad4c0");

/**
 * Checks if the current request is a demo request by looking for the "demo" cookie.
 * @returns True if the current request is a demo request (i.e., has the "demo" cookie set), false otherwise.
 */
export async function checkDemoRequest() {
  const cookieStore = await cookies();
  return cookieStore.has("demo");
}

/**
 * @param id - The original user ID (from the authentication session)
 * @returns The scoped user ID, which is the demo user ID if the request is a demo request, or the original user ID converted to an ObjectId otherwise. Returns null if no ID is provided and it's not a demo request.
 */
export async function getScopedUserId(id: string | undefined) {
  if (id) return id ? new ObjectId(id) : null;
  const isDemo = await checkDemoRequest();
  if (isDemo) return DEMO_USER_ID;
  return null;
}
