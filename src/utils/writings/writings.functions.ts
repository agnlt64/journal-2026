import { createServerFn } from "@tanstack/react-start";
import type { WritingFormValues } from "@/lib/types";
import {
  getWritings as getWritings_,
  createWriting as createWriting_
} from "./writings.server";

export const getWritings = createServerFn().handler(async () => {
  return getWritings_();
});

export const createWriting = createServerFn()
  .inputValidator((data: { data: WritingFormValues }) => data)
  .handler(async ({ data }) => {
    return createWriting_(data.data);
  });