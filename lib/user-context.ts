import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";

/**
 * Returns the authenticated user from the current request, or null.
 * Server-only — must be called inside a server function or loader.
 */
export async function getCurrentUser() {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  return session?.user ?? null;
}

/**
 * Same as getCurrentUser but throws when there is no session.
 * Used by server functions that require an authenticated user.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
