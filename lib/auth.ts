import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "./db";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  // tanstackStartCookies must be the LAST plugin
  plugins: [tanstackStartCookies()],
});
