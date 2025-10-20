import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import connectToDatabase from "@/lib/db";
import { ENVSchema } from "@/lib/load-env";
import { demoCookiePlugin, onBoardingPlugin } from "./auth.plugins";

const TEST_EXPIRES_IN = 5 * 60 * 60;
const PROD_EXPIRES_IN = 12 * 60 * 60; // 12 hours

const trustedOrigins = (request: Request) => {
  const origin = request.headers.get("origin");
  const localIpPattern = /^http:\/\/192\.168\.\d+\.\d+:3000$/;
  const devOrigins = ["http://localhost:3000"];

  if (origin && localIpPattern.test(origin)) devOrigins.push(origin);

  return ENVSchema.NODE_ENV === "development" ? devOrigins : [ENVSchema.BETTER_AUTH_URL];
};

const { db, client } = await connectToDatabase();
export const auth = betterAuth({
  appName: "Personal Finance App",
  baseURL:
    ENVSchema.NODE_ENV !== "development" ? ENVSchema.BETTER_AUTH_URL : "http://localhost:3000",
  secret: ENVSchema.BETTER_AUTH_SECRET,
  trustedOrigins,
  user: {
    deleteUser: { enabled: true },
    additionalFields: {
      tier: { type: "string", defaultValue: "Basic", input: false },
      hasFinalized: { type: "boolean", defaultValue: false },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
    expiresIn: ENVSchema.NODE_ENV === "production" ? PROD_EXPIRES_IN : TEST_EXPIRES_IN,
    freshAge: 15 * 60, // 15 minutes
    updateAge: 15 * 60, // 15 minutes
  },
  emailAndPassword: { enabled: true },
  database: mongodbAdapter(db, { client, usePlural: true }),
  plugins: [demoCookiePlugin(), onBoardingPlugin(), nextCookies()],
});
