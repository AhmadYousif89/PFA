export const runtime = "nodejs";

import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/app/(auth)/_lib/auth";

export const { GET, POST } = toNextJsHandler(auth.handler);
