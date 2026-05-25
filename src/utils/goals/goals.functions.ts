import { createServerFn } from "@tanstack/react-start";
import {
  createGoal as createGoal_
} from "./goals.server";

export const createGoal = createServerFn()
  .inputValidator((data: { data: unknown }) => data)
  .handler(async ({ data }) => {
    return createGoal_(data.data)
  });