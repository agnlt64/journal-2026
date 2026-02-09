"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import {
  projectSchema,
  ProjectFormValues,
  ProjectDTO,
  ProjectLinkDTO,
} from "@/lib/types";
import { revalidatePath } from "next/cache";
import type { ProjectLink } from "@/lib/generated/prisma/client";

export async function getProjects(): Promise<ProjectDTO[]> {
  const user = await getCurrentUser();

  const projects = await db.project.findMany({
    where: { userId: user.id },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    include: { links: true },
  });

  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    status: p.status as ProjectDTO["status"],
    links: p.links.map(
      (l: ProjectLink): ProjectLinkDTO => ({
        id: l.id,
        title: l.title,
        url: l.url,
      }),
    ),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

export async function createProject(data: ProjectFormValues) {
  const user = await getCurrentUser();
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
    include: { links: true },
  });

  revalidatePath("/projets");
  return project;
}

export async function updateProject(id: string, data: ProjectFormValues) {
  const user = await getCurrentUser();
  const parsed = projectSchema.parse(data);

  // Delete existing links and create new ones
  await db.projectLink.deleteMany({
    where: { projectId: id },
  });

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
    include: { links: true },
  });

  revalidatePath("/projets");
  return project;
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser();

  await db.project.delete({
    where: { id, userId: user.id },
  });

  revalidatePath("/projets");
}

export async function updateProjectStatus(
  id: string,
  status: ProjectDTO["status"],
) {
  const user = await getCurrentUser();

  await db.project.update({
    where: { id, userId: user.id },
    data: { status },
  });

  revalidatePath("/projets");
}
