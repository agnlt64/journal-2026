"use server";

import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-context";
import { writingSchema, WritingFormValues } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createWriting(data: WritingFormValues) {
  const user = await getOrCreateUser();
  const parsed = writingSchema.parse(data);

  await db.writing.create({
    data: {
      userId: user.id,
      title: parsed.title,
      content: parsed.content,
    },
  });

  revalidatePath("/writings");
}

export async function getWritings() {
  const user = await getOrCreateUser();
  return await db.writing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}
