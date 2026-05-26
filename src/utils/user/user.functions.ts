import { createServerFn } from "@tanstack/react-start";
import {
  updateSettings as updateSettings_,
  getUserSettings as getUserSettings_
} from "./user.server";

export const updateSettings = createServerFn()
  .inputValidator((data: {
    blurLevel?: number;
    itemsPerPage?: number;
    pinCode?: string;
  }) => data)
  .handler(async ({ data }) => {
    updateSettings_(data);
  });

export const getUserSettings = createServerFn().handler(async () => {
  return getUserSettings_();
});