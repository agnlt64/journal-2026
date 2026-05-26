import { createServerFn } from "@tanstack/react-start";
import {
    createProject as createProject_,
    updateProject as updateProject_,
    getProjects as getProjects_,
    getProject as getProject_,
    deleteProject as deleteProject_,
    updateProjectStatus as updateProjectStatus_,
    createProjectStep as createProjectStep_,
    updateProjectStep as updateProjectStep_,
    deleteProjectStep as deleteProjectStep_,
    toggleProjectStep as toggleProjectStep_,
    reorderProjectSteps as reorderProjectSteps_,
} from "./projects.server";
import { ProjectFormValues, ProjectDTO, ProjectStepFormValues } from "@/lib/types";

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

export const createProjectStep = createServerFn()
  .inputValidator((data: { projectId: string, data: ProjectStepFormValues}) => data)
  .handler(async ({ data }) =>{
    return createProjectStep_(data.projectId, data.data);
  });

export const updateProjectStep = createServerFn()
  .inputValidator((data: { id: string, data: ProjectStepFormValues}) => data)
  .handler(async ({ data }) =>{
    return updateProjectStep_(data.id, data.data);
  });

export const deleteProjectStep = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) =>{
    return deleteProjectStep_(id);
  });

export const toggleProjectStep = createServerFn()
  .inputValidator((data: { id: string, completed: boolean, comment?: string}) => data)
  .handler(async ({ data }) =>{
    return toggleProjectStep_(data.id, data.completed, data.comment);
  });

export const reorderProjectSteps = createServerFn()
  .inputValidator((data: { projectId: string, orderedIds: string[]}) => data)
  .handler(async ({ data }) =>{
    return reorderProjectSteps_(data.projectId, data.orderedIds);
  });

export const getProject = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data }) => {
    return getProject_(data)
  });