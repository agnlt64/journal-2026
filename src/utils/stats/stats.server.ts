import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-context";
import type { StatsEntryDTO } from "@/lib/types";

export async function getStatsData(): Promise<StatsEntryDTO[]> {
  const user = await getOrCreateUser();

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
  const user = await getOrCreateUser();

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
  const user = await getOrCreateUser();
  return user.counter;
}

export async function updateCounter(delta: number): Promise<number> {
  const user = await getOrCreateUser();

  const updated = await db.user.update({
    where: { id: user.id },
    data: { counter: user.counter + delta },
  });

  return updated.counter;
}
