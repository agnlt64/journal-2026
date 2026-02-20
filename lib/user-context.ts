import { db } from "@/lib/db";

export async function getOrCreateUser() {
  const user = await db.user.findFirst();

  if (user) return user;

  return db.user.create({
    data: {
      email: "me@journal.com",
      passwordHash: "LOCAL_USER",
    },
  });
}