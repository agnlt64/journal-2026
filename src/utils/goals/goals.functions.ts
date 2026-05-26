import { createServerFn } from "@tanstack/react-start";
import {
  createGoal as createGoal_,
  getGoals as getGoals_,
  toggleGoalCompletion as toggleGoalCompletion_,
  updateGoalRemark as updateGoalRemark_,
} from "./goals.server";

export const createGoal = createServerFn()
  .inputValidator((data: { data: unknown }) => data)
  .handler(async ({ data }) => {
    return createGoal_(data.data)
  });

export const getGoals = createServerFn().handler(async () => {
  return getGoals_();
});

export const toggleGoalCompletion = createServerFn()
  .inputValidator((data: { goalId: string }) => data)
  .handler(async ({ data }) => {
    return toggleGoalCompletion_(data.goalId)
  })

export const updateGoalRemark = createServerFn()
  .inputValidator((data: { goalId: string, remark: string | null }) => data)
  .handler(async ({ data }) => {
    return updateGoalRemark_(data.goalId, data.remark)
  });