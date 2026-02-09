import { db } from "@/lib/db";

export async function getCurrentUser() {
  // For this personal app, we check if a user exists, if not we create the default one.
  // In a real app this would use sessions/cookies.
  // We assume single user for "Mon Journal"

  const user = await db.user.findFirst();

  if (!user) {
    return await db.user.create({
      data: {
        email: "me@journal.com",
        passwordHash: "TODO_HASH",
        // We can add a proper default password flow later if needed
      },
    });
  }

  return user;
}
