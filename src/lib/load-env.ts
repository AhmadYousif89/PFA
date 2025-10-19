import z from "zod";

const schema = z.object({
  MONGODB_URI: z.string(),
  MONGODB_NAME: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  NODE_ENV: z.enum(["development", "production", "vercel", "test"]).default("development"),
});

export const ENVSchema = schema.parse(process.env);
