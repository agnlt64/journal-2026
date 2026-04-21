"use server";

import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-context";
import {
  projectSchema,
  projectStepSchema,
  ProjectFormValues,
  ProjectStepFormValues,
  ProjectDTO,
  ProjectLinkDTO,
  ProjectStepDTO,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import type { ProjectLink, ProjectStep } from "@/lib/generated/prisma/client";

function revalidateProject(id?: string) {
  revalidatePath("/projets");
  if (id) revalidatePath(`/projets/${id}`);
}

function mapStep(s: ProjectStep): ProjectStepDTO {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    order: s.order,
    completedAt: s.completedAt,
    completionComment: s.completionComment,
  };
}

export async function getProjects(): Promise<ProjectDTO[]> {
  const user = await getOrCreateUser();

  const projects = await db.project.findMany({
    where: { userId: user.id },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: {
      links: true,
      steps: { orderBy: { order: "asc" } },
    },
  });

  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    status: p.status,
    links: p.links.map(
      (l: ProjectLink): ProjectLinkDTO => ({
        id: l.id,
        title: l.title,
        url: l.url,
      }),
    ),
    steps: p.steps.map(mapStep),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

export async function getProject(id: string): Promise<ProjectDTO | null> {
  const user = await getOrCreateUser();

  const p = await db.project.findUnique({
    where: { id, userId: user.id },
    include: {
      links: true,
      steps: { orderBy: { order: "asc" } },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    title: p.title,
    description: p.description,
    status: p.status,
    links: p.links.map(
      (l: ProjectLink): ProjectLinkDTO => ({
        id: l.id,
        title: l.title,
        url: l.url,
      }),
    ),
    steps: p.steps.map(mapStep),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function createProject(data: ProjectFormValues) {
  const user = await getOrCreateUser();
  const parsed = projectSchema.parse(data);

  const project = await db.project.create({
    data: {
      userId: user.id,
      title: parsed.title,
      description: parsed.description || "",
      status: parsed.status,
      links: {
        create: parsed.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
      },
    },
    include: { links: true, steps: true },
  });

  revalidateProject();
  return project;
}

export async function updateProject(id: string, data: ProjectFormValues) {
  const user = await getOrCreateUser();
  const parsed = projectSchema.parse(data);

  await db.projectLink.deleteMany({ where: { projectId: id } });

  const project = await db.project.update({
    where: { id, userId: user.id },
    data: {
      title: parsed.title,
      description: parsed.description || "",
      status: parsed.status,
      links: {
        create: parsed.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
      },
    },
    include: { links: true, steps: true },
  });

  revalidateProject(id);
  return project;
}

export async function deleteProject(id: string) {
  const user = await getOrCreateUser();

  await db.project.delete({ where: { id, userId: user.id } });

  revalidateProject(id);
}

export async function updateProjectStatus(
  id: string,
  status: ProjectDTO["status"],
) {
  const user = await getOrCreateUser();

  await db.project.update({
    where: { id, userId: user.id },
    data: { status },
  });

  revalidateProject(id);
}

// ─── Project Steps ───────────────────────────────────────────────────────────

export async function createProjectStep(
  projectId: string,
  data: ProjectStepFormValues,
) {
  const user = await getOrCreateUser();
  const parsed = projectStepSchema.parse(data);

  // Verify project belongs to user
  const project = await db.project.findUnique({
    where: { id: projectId, userId: user.id },
    select: { id: true, _count: { select: { steps: true } } },
  });
  if (!project) throw new Error("Projet introuvable");

  const step = await db.projectStep.create({
    data: {
      projectId,
      title: parsed.title,
      description: parsed.description || null,
      order: project._count.steps,
    },
  });

  revalidateProject(projectId);
  return mapStep(step);
}

export async function updateProjectStep(
  id: string,
  data: ProjectStepFormValues,
) {
  const user = await getOrCreateUser();
  const parsed = projectStepSchema.parse(data);

  const existing = await db.projectStep.findFirst({
    where: { id, project: { userId: user.id } },
  });
  if (!existing) throw new Error("Étape introuvable");

  const step = await db.projectStep.update({
    where: { id },
    data: {
      title: parsed.title,
      description: parsed.description || null,
    },
  });

  revalidateProject(existing.projectId);
  return mapStep(step);
}

export async function deleteProjectStep(id: string) {
  const user = await getOrCreateUser();

  const existing = await db.projectStep.findFirst({
    where: { id, project: { userId: user.id } },
  });
  if (!existing) throw new Error("Étape introuvable");

  await db.projectStep.delete({ where: { id } });

  // Re-sequence remaining steps
  const remaining = await db.projectStep.findMany({
    where: { projectId: existing.projectId },
    orderBy: { order: "asc" },
  });
  await db.$transaction(
    remaining.map((s, i) =>
      db.projectStep.update({ where: { id: s.id }, data: { order: i } }),
    ),
  );

  revalidateProject(existing.projectId);
}

export async function toggleProjectStep(
  id: string,
  completed: boolean,
  comment?: string,
) {
  const user = await getOrCreateUser();

  const existing = await db.projectStep.findFirst({
    where: { id, project: { userId: user.id } },
  });
  if (!existing) throw new Error("Étape introuvable");

  const step = await db.projectStep.update({
    where: { id },
    data: {
      completedAt: completed ? new Date() : null,
      completionComment: completed ? (comment || null) : null,
    },
  });

  revalidateProject(existing.projectId);
  return mapStep(step);
}

export async function reorderProjectSteps(
  projectId: string,
  orderedIds: string[],
) {
  const user = await getOrCreateUser();

  const project = await db.project.findUnique({
    where: { id: projectId, userId: user.id },
    select: { id: true },
  });
  if (!project) throw new Error("Projet introuvable");

  await db.$transaction(
    orderedIds.map((id, i) =>
      db.projectStep.update({ where: { id }, data: { order: i } }),
    ),
  );

  revalidateProject(projectId);
}
