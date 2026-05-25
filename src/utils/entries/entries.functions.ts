import {
  getTags as getTags_,
  getEntries as getEntries_,
  createEntry as createEntry_,
  createTag as createTag_,
  updateEntry as updateEntry_,
  getLockedEntry as getLockedEntry_,
} from "./entries.server";
import { createServerFn } from "@tanstack/react-start";
import type { EntryFormValues } from "@/lib/types";

export const getTags = createServerFn().handler(async () => {
  return getTags_();
});

export const getEntries = createServerFn()
  .inputValidator((data: { page: number, searchQuery: string, includeEmpty: boolean }) => data)
  .handler(async ({ data }) => {
    return getEntries_(data.page, data.searchQuery, data.includeEmpty);
  });

export const createEntry = createServerFn()
  .inputValidator((data: EntryFormValues & { tagIds?: string[] }) => data)
  .handler(async ({ data }) => {
    return createEntry_(data);
  });

export const createTag = createServerFn()
  .inputValidator((data: { name: string, color: string }) => data)
  .handler(async ({ data }) => {
    return createTag_(data.name, data.color);
  });

export const updateEntry = createServerFn()
  .inputValidator((data: { id: string, data: EntryFormValues & { tagIds?: string[] } }) => data)
  .handler(async ({ data }) => {
    return updateEntry_(data.id, data.data);
  });

export const getLockedEntry = createServerFn()
  .inputValidator((data: { id: string, pin: string }) => data)
  .handler(async ({ data }) => {
    return getLockedEntry_(data.id, data.pin)
  });