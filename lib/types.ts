import { z } from "zod";
import { ProjectStatus } from "@/lib/generated/prisma/enums";

// ════════════════════════════════════════════════════════════════════════════
// Entries
// ════════════════════════════════════════════════════════════════════════════

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

export interface TagDTO {
  id: string;
  name: string;
  color: string;
}

export interface ImageDTO {
  id: string;
  url: string;
}

export interface EntryDTO {
  id: string;
  content: string;
  date: Date;
  tags: TagDTO[];
  wakeTime: Date | null;
  sleepTime: Date | null;
  didSport: boolean;
  asmr: boolean;
  screenTime: number | null;
  images: ImageDTO[];
  createdAt: Date;
  updatedAt: Date;
}

// ════════════════════════════════════════════════════════════════════════════
// Writings
// ════════════════════════════════════════════════════════════════════════════

export const writingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export type WritingFormValues = z.infer<typeof writingSchema>;

export interface WritingDTO {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

// ════════════════════════════════════════════════════════════════════════════
// Goals
// ════════════════════════════════════════════════════════════════════════════

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

// ════════════════════════════════════════════════════════════════════════════
// Projects
// ════════════════════════════════════════════════════════════════════════════

export const projectLinkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  url: z.url("L'URL doit être valide"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  status: z.enum(ProjectStatus),
  links: z.array(projectLinkSchema),
});

export const projectStepSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
export type ProjectLinkFormValues = z.infer<typeof projectLinkSchema>;
export type ProjectStepFormValues = z.infer<typeof projectStepSchema>;

export interface ProjectLinkDTO {
  id: string;
  title: string;
  url: string;
}

export interface ProjectStepDTO {
  id: string;
  title: string;
  description: string | null;
  order: number;
  completedAt: Date | null;
  completionComment: string | null;
}

export interface ProjectDTO {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  links: ProjectLinkDTO[];
  steps: ProjectStepDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  IDEA: "Idée",
  RESEARCH: "Recherches en cours",
  STARTED: "Commencé",
  ACTIVE_DEV: "Développement actif",
  DONE: "Terminé",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  IDEA: "#F0AC0E",
  RESEARCH: "#06B6D4",
  STARTED: "#D946EF",
  ACTIVE_DEV: "#3B82F6",
  DONE: "#10B981",
};

export const PROJECT_STATUS_OPTIONS: ProjectStatus[] = [
  ProjectStatus.IDEA,
  ProjectStatus.RESEARCH,
  ProjectStatus.STARTED,
  ProjectStatus.ACTIVE_DEV,
  ProjectStatus.DONE,
];

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  ProjectStatus.ACTIVE_DEV,
  ProjectStatus.STARTED,
  ProjectStatus.RESEARCH,
  ProjectStatus.IDEA,
  ProjectStatus.DONE,
];

// ════════════════════════════════════════════════════════════════════════════
// Stats
// ════════════════════════════════════════════════════════════════════════════

export interface StatsEntryDTO {
  id: string;
  date: Date;
  wakeTime: Date | null;
  sleepTime: Date | null;
  screenTime: number | null;
}
