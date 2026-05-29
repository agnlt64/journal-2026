import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-context";
import { writingSchema } from "@/lib/types";
import type { WritingDTO, WritingFormValues } from "@/lib/types";
import type { Writing } from "@/generated/prisma/client";

function mapWriting(w: Writing): WritingDTO {
  return {
    id: w.id,
    title: w.title,
    content: w.content,
    createdAt: w.createdAt,
  };
}

export async function createWriting(data: WritingFormValues): Promise<void> {
  const user = await getOrCreateUser();
  const parsed = writingSchema.parse(data);

  await db.writing.create({
    data: {
      userId: user.id,
      title: parsed.title,
      content: parsed.content,
    },
  });
}

export async function getWritings(): Promise<WritingDTO[]> {
  const user = await getOrCreateUser();
  const writings = await db.writing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return writings.map(mapWriting);
}
