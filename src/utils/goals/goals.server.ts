import { db } from "@/lib/db";
import { requireUser } from "@/lib/user-context";
import { goalSchema } from "@/lib/types";
import type { GoalDTO, GoalFormValues } from "@/lib/types";
import type { Goal } from "@/generated/prisma/client";

function mapGoal(g: Goal): GoalDTO {
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    deadline: g.deadline,
    isCompleted: g.isCompleted,
    completedAt: g.completedAt,
    remark: g.remark,
    createdAt: g.createdAt,
  };
}

export async function createGoal(data: GoalFormValues): Promise<void> {
  const user = await requireUser();
  const parsed = goalSchema.parse(data);

  await db.goal.create({
    data: {
      userId: user.id,
      title: parsed.title,
      description: parsed.description || null,
      deadline: parsed.deadline,
    },
  });
}

export async function getGoals(): Promise<GoalDTO[]> {
  const user = await requireUser();
  const goals = await db.goal.findMany({
    where: { userId: user.id },
    orderBy: { deadline: "asc" },
  });
  return goals.map(mapGoal);
}

export async function toggleGoalCompletion(goalId: string): Promise<void> {
  const user = await requireUser();

  const goal = await db.goal.findFirst({
    where: { id: goalId, userId: user.id },
  });
  if (!goal) throw new Error("Goal not found");

  const newCompleted = !goal.isCompleted;

  await db.goal.update({
    where: { id: goalId },
    data: {
      isCompleted: newCompleted,
      completedAt: newCompleted ? new Date() : null,
    },
  });
}

export async function updateGoalRemark(
  goalId: string,
  remark: string | null,
): Promise<void> {
  const user = await requireUser();

  const goal = await db.goal.findFirst({
    where: { id: goalId, userId: user.id },
  });
  if (!goal) throw new Error("Goal not found");

  await db.goal.update({
    where: { id: goalId },
    data: { remark: remark?.trim() || null },
  });
}
