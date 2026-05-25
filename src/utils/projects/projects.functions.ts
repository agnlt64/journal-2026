import { createServerFn } from "@tanstack/react-start";
import {
    createProject as createProject_,
    updateProject as updateProject_,
    getProjects as getProjects_,
    deleteProject as deleteProject_,
    updateProjectStatus as updateProjectStatus_
} from "./projects.server";
import { ProjectFormValues, ProjectDTO } from "@/lib/types";

export const createProject = createServerFn()
  .inputValidator((data: ProjectFormValues) => data)
  .handler(async ({ data }) => {
    return createProject_(data);
  });

export const updateProject = createServerFn()
  .inputValidator((data: { id: string, data: ProjectFormValues }) => data)
  .handler(async ({ data }) => {
    return updateProject_(data.id, data.data)
  });

export const getProjects = createServerFn().handler(async () => {
  return getProjects_();
});

export const deleteProject = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data }) => {
    return deleteProject_(data)
  })

export const updateProjectStatus = createServerFn()
  .inputValidator((data: {id: string, status: ProjectDTO["status"]}) => data)
  .handler(async ({ data }) => {
    return updateProjectStatus_(data.id, data.status)
  });