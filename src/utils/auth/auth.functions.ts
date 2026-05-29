import { createServerFn } from "@tanstack/react-start";
import { getCurrentUser } from "@/lib/user-context";

/**
 * Returns the authenticated user (or null) for loaders & client components.
 * Wraps `getCurrentUser` so it can be called from loaders, which run on both
 * server and client.
 */
export const getSessionUser = createServerFn({ method: "GET" }).handler(
  async () => {
    return getCurrentUser();
  },
);
