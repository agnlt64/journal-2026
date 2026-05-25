import { createServerFn } from "@tanstack/react-start";
import {
  getStatsData as getStatsData_,
  getEntryDates as getEntryDates_,
  getCounter as getCounter_,
  updateCounter as updateCounter_
} from "./stats.server";

export const getStatsData = createServerFn().handler(async () => {
  return getStatsData_();
});

export const getEntryDates = createServerFn().handler(async () => {
  return getEntryDates_();
});

export const getCounter = createServerFn().handler(async () => {
  return getCounter_();
});

export const updateCounter = createServerFn()
  .inputValidator((delta: number) => delta)
  .handler(async ({ data }) => {
    return updateCounter_(data)
  })