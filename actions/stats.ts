"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export interface StatsEntry {
    id: string;
    date: Date;
    wakeTime: Date | null;
    sleepTime: Date | null;
    screenTime: number | null;
}

export async function getStatsData(): Promise<StatsEntry[]> {
    const user = await getCurrentUser();

    const entries = await db.entry.findMany({
        where: { userId: user.id },
        select: {
            id: true,
            date: true,
            wakeTime: true,
            sleepTime: true,
            screenTime: true,
        },
        orderBy: { date: "asc" }
    });

    return entries;
}

export async function getEntryDates(): Promise<Date[]> {
    const user = await getCurrentUser();

    const entries = await db.entry.findMany({
        where: {
            userId: user.id,
            content: { not: "" }
        },
        select: { date: true },
    });

    return entries.map(e => e.date);
}
