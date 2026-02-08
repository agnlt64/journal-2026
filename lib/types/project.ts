import { z } from "zod";

// Project schemas
export const projectLinkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  url: z.string().url("L'URL doit être valide"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "POC_DONE", "MVP_DONE", "DONE", "ARCHIVED"]),
  links: z.array(projectLinkSchema),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
export type ProjectLinkFormValues = z.infer<typeof projectLinkSchema>;

// Project DTO
export interface ProjectLinkDTO {
  id: string;
  title: string;
  url: string;
}

export interface ProjectDTO {
  id: string;
  title: string;
  description: string | null;
  status: "DRAFT" | "IN_PROGRESS" | "POC_DONE" | "MVP_DONE" | "DONE" | "ARCHIVED";
  links: ProjectLinkDTO[];
  createdAt: Date;
  updatedAt: Date;
}

// Status labels in French
export const PROJECT_STATUS_LABELS: Record<ProjectDTO["status"], string> = {
  DRAFT: "Brouillon",
  IN_PROGRESS: "En cours",
  POC_DONE: "POC Terminé",
  MVP_DONE: "MVP Terminé",
  DONE: "Terminé",
  ARCHIVED: "Archivé",
};

// Status colors
export const PROJECT_STATUS_COLORS: Record<ProjectDTO["status"], string> = {
  DRAFT: "#888888",
  IN_PROGRESS: "#00f5ff",
  POC_DONE: "#b829dd",
  MVP_DONE: "#ffbe0b",
  DONE: "#7bb88b",
  ARCHIVED: "#555555",
};
