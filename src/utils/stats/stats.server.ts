import { db } from "@/lib/db";
import { requireUser } from "@/lib/user-context";
import type { StatsEntryDTO } from "@/lib/types";

export async function getStatsData(): Promise<StatsEntryDTO[]> {
  const user = await requireUser();

  const entries = await db.entry.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      date: true,
      wakeTime: true,
      sleepTime: true,
      screenTime: true,
    },
    orderBy: { date: "asc" },
  });

  return entries.map((e) => ({
    id: e.id,
    date: e.date,
    wakeTime: e.wakeTime,
    sleepTime: e.sleepTime,
    screenTime: e.screenTime,
  }));
}

export async function getEntryDates(): Promise<Date[]> {
  const user = await requireUser();

  const entries = await db.entry.findMany({
    where: {
      userId: user.id,
      content: { not: "" },
    },
    select: { date: true },
  });

  return entries.map((e) => e.date);
}

export async function getCounter(): Promise<number> {
  const user = await requireUser();
  const row = await db.user.findUnique({
    where: { id: user.id },
    select: { counter: true },
  });
  return row?.counter ?? 0;
}

export async function updateCounter(delta: number): Promise<number> {
  const user = await requireUser();

  // Atomic increment — no read-modify-write race.
  const updated = await db.user.update({
    where: { id: user.id },
    data: { counter: { increment: delta } },
    select: { counter: true },
  });

  return updated.counter;
}
