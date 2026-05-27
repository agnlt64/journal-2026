import { z } from "zod";

// Zod Schemas

export const entrySchema = z.object({
  content: z.string().optional(),
  date: z.date(),
  tagIds: z.array(z.string()).optional(),
  // Optional fields
  wakeTime: z.date().optional(),
  sleepTime: z.date().optional(),
  didSport: z.boolean().default(false),
  asmr: z.boolean().default(false),
  screenTime: z.number().optional(), // Temps d'écran moyen en minutes
});

export type EntryFormValues = z.infer<typeof entrySchema>;

export const writingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export type WritingFormValues = z.infer<typeof writingSchema>;

// DTOs for Client Consumption

export interface TagDTO {
  id: string;
  name: string;
  color: string;
}

export interface EntryDTO {
  id: string;
  content: string;
  date: Date;
  tags: TagDTO[];
  // Specifics
  wakeTime: Date | null;
  sleepTime: Date | null;
  didSport: boolean;
  asmr: boolean;
  screenTime: number | null;

  images: ImageDTO[];

  createdAt: Date;
  updatedAt: Date;
}

export interface ImageDTO {
  id: string;
  url: string;
}

export interface WritingDTO {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

// Goal types
export const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deadline: z.date(),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export interface GoalDTO {
  id: string;
  title: string;
  description: string | null;
  deadline: Date;
  isCompleted: boolean;
  completedAt: Date | null;
  remark: string | null;
  createdAt: Date;
}

// Re-export project types
export * from "./types/project";
