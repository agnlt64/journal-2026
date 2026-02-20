"use server";

import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-context";
import { goalSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createGoal(data: unknown) {
  const user = await getOrCreateUser();
  const parsed = goalSchema.parse(data);

  await db.goal.create({
    data: {
      userId: user.id,
      title: parsed.title,
      description: parsed.description || null,
      deadline: parsed.deadline,
    },
  });

  revalidatePath("/objectifs");
}

export async function getGoals() {
  const user = await getOrCreateUser();
  return await db.goal.findMany({
    where: { userId: user.id },
    orderBy: { deadline: "asc" },
  });
}

export async function toggleGoalCompletion(goalId: string) {
  const user = await getOrCreateUser();

  const goal = await db.goal.findFirst({
    where: { id: goalId, userId: user.id },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  const newCompleted = !goal.isCompleted;

  await db.goal.update({
    where: { id: goalId },
    data: {
      isCompleted: newCompleted,
      completedAt: newCompleted ? new Date() : null,
    },
  });

  revalidatePath("/objectifs");
}

export async function updateGoalRemark(goalId: string, remark: string | null) {
  const user = await getOrCreateUser();

  const goal = await db.goal.findFirst({
    where: { id: goalId, userId: user.id },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  await db.goal.update({
    where: { id: goalId },
    data: {
      remark: remark?.trim() || null,
    },
  });

  revalidatePath("/objectifs");
}
