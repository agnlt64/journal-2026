"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { entrySchema, EntryFormValues, EntryDTO, TagDTO } from "@/lib/types";
import { revalidatePath } from "next/cache";
import type { Image, Tag } from "@/lib/generated/prisma/client";
import { Prisma } from "@/lib/generated/prisma/client";

// Default tags to create for new users
const DEFAULT_TAGS = [
    { name: "normal", color: "#6366f1" },    // Indigo
    { name: "médical", color: "#ef4444" },   // Red
    { name: "rêve", color: "#8b5cf6" },      // Purple
];

export async function ensureDefaultTags(userId: string) {
    for (const tag of DEFAULT_TAGS) {
        await db.tag.upsert({
            where: { userId_name: { userId, name: tag.name } },
            create: { userId, name: tag.name, color: tag.color },
            update: {},
        });
    }
}

export async function getTags(): Promise<TagDTO[]> {
    const user = await getCurrentUser();
    await ensureDefaultTags(user.id);

    const tags = await db.tag.findMany({
        where: { userId: user.id },
        orderBy: { name: "asc" },
    });

    return tags.map(t => ({ id: t.id, name: t.name, color: t.color }));
}

export async function createTag(name: string, color: string): Promise<TagDTO> {
    const user = await getCurrentUser();

    const tag = await db.tag.create({
        data: { userId: user.id, name, color }
    });

    return { id: tag.id, name: tag.name, color: tag.color };
}

export async function createEntry(data: EntryFormValues & { tagIds?: string[] }) {
    const user = await getCurrentUser();
    const parsed = entrySchema.parse(data);

    if (parsed.isLocked && !user.pinCodeHash) {
        throw new Error("You must set a Global PIN in settings before locking entries.");
    }

    await db.entry.create({
        data: {
            userId: user.id,
            content: parsed.content || "",
            date: parsed.date,
            wakeTime: parsed.wakeTime,
            sleepTime: parsed.sleepTime,
            didSport: parsed.didSport,
            asmr: parsed.asmr,
            screenTime: parsed.screenTime,
            isLocked: parsed.isLocked,
            tags: parsed.tagIds?.length ? {
                connect: parsed.tagIds.map(id => ({ id }))
            } : undefined,
        }
    });

    revalidatePath("/");
    return { success: true };
}

export async function getEntries(page = 1, searchQuery = "", includeEmpty = false): Promise<{ data: EntryDTO[], total: number }> {
    const user = await getCurrentUser();
    const itemsPerPage = user.itemsPerPage || 20;

    const where: Prisma.EntryWhereInput = {
        userId: user.id,
        ...(searchQuery
            ? { content: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } }
            : (!includeEmpty ? { content: { not: "" } } : {})
        ),
    };

    const [entries, total] = await Promise.all([
        db.entry.findMany({
            where,
            orderBy: { date: "desc" },
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
            include: { images: true, tags: true }
        }),
        db.entry.count({ where })
    ]);

    // Transform to DTO with Redaction
    const dtos: EntryDTO[] = entries.map((e) => {
        const isLocked = e.isLocked;
        const entryWithRelations = e as typeof e & { tags: Tag[], images: Image[] };

        return {
            id: e.id,
            content: isLocked ? null : e.content,
            date: e.date,
            tags: entryWithRelations.tags.map((t: Tag) => ({ id: t.id, name: t.name, color: t.color })),
            wakeTime: e.wakeTime,
            sleepTime: e.sleepTime,
            didSport: e.didSport,
            asmr: e.asmr,
            screenTime: e.screenTime,
            isLocked: e.isLocked,
            images: isLocked ? [] : entryWithRelations.images.map((i: Image) => ({ id: i.id, url: i.url })),
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
        };
    });

    return { data: dtos, total };
}

export async function getLockedEntry(id: string, pin: string) {
    const user = await getCurrentUser();

    if (!user.pinCodeHash) throw new Error("No PIN set");
    if (user.pinCodeHash !== pin) {
        return { success: false, error: "Invalid PIN" };
    }

    const entry = await db.entry.findUnique({
        where: { id, userId: user.id },
        include: { images: true, tags: true }
    });

    if (!entry) return { success: false, error: "Not found" };

    return {
        success: true,
        data: {
            ...entry,
            tags: entry.tags.map((t: Tag) => ({ id: t.id, name: t.name, color: t.color })),
            images: entry.images.map((i: Image) => ({ id: i.id, url: i.url }))
        }
    };
}

export async function deleteEntry(id: string) {
    const user = await getCurrentUser();
    await db.entry.delete({ where: { id, userId: user.id } });
    revalidatePath("/");
}

export async function updateEntry(id: string, data: EntryFormValues & { tagIds?: string[] }) {
    const user = await getCurrentUser();
    const parsed = entrySchema.parse(data);

    await db.entry.update({
        where: { id, userId: user.id },
        data: {
            content: parsed.content || "",
            date: parsed.date,
            wakeTime: parsed.wakeTime,
            sleepTime: parsed.sleepTime,
            didSport: parsed.didSport,
            asmr: parsed.asmr,
            screenTime: parsed.screenTime,
            isLocked: parsed.isLocked,
            tags: {
                set: parsed.tagIds?.map(tid => ({ id: tid })) || []
            }
        }
    });
    revalidatePath("/");
}
