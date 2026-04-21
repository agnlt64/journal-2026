"use client";

import { useState } from "react";
import {
  ProjectDTO,
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_OPTIONS,
} from "@/lib/types";
import { updateProjectStatus } from "@/actions/project";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectStatusSelectProps {
  projectId: string;
  currentStatus: ProjectDTO["status"];
}

export function ProjectStatusSelect({
  projectId,
  currentStatus,
}: ProjectStatusSelectProps) {
  const [status, setStatus] = useState<ProjectDTO["status"]>(currentStatus);

  async function handleChange(value: ProjectDTO["status"] | null) {
    if (!value) return;
    setStatus(value);
    await updateProjectStatus(projectId, value);
  }

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger
        size="sm"
        className="w-56 bg-transparent border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] text-white"
      >
        <SelectValue>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: PROJECT_STATUS_COLORS[status] }}
            />
            <span className="text-sm">{PROJECT_STATUS_LABELS[status]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-56 min-w-56">
        {PROJECT_STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s}>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: PROJECT_STATUS_COLORS[s] }}
              />
              <span>{PROJECT_STATUS_LABELS[s]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
