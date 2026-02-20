"use server";

import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-context";
import { revalidatePath } from "next/cache";

export async function updateSettings(data: {
  blurLevel?: number;
  itemsPerPage?: number;
  pinCode?: string;
}) {
  const user = await getOrCreateUser();

  await db.user.update({
    where: { id: user.id },
    data: {
      blurLevel: data.blurLevel,
      itemsPerPage: data.itemsPerPage,
      pinCodeHash: data.pinCode, // Storing plain for now as per "simple auth" instruction interpretation, valid for personal local app.
    },
  });

  revalidatePath("/");
}

export async function getUserSettings() {
  const user = await getOrCreateUser();
  return {
    blurLevel: user.blurLevel,
    itemsPerPage: user.itemsPerPage,
    hasPin: !!user.pinCodeHash,
  };
}
