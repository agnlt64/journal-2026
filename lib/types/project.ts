import { z } from "zod";
import { ProjectStatus } from "@/lib/generated/prisma/client";

// Project schemas
export const projectLinkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  url: z.string().url("L'URL doit être valide"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
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
  status: ProjectStatus;
  links: ProjectLinkDTO[];
  createdAt: Date;
  updatedAt: Date;
}

// Status labels in French
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  IDEA: "Idée",
  RESEARCH: "Recherches en cours",
  STARTED: "Commencé",
  ACTIVE_DEV: "Développement actif",
  DONE: "Terminé",
};

// Status colors
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
