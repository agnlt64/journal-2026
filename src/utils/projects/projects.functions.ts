import { createServerFn } from "@tanstack/react-start";
import {
    createProject as createProject_,
    updateProject as updateProject_,
    getProjects as getProjects_
} from "./projects.server";
import { ProjectFormValues } from "@/lib/types";

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