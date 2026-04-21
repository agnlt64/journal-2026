"use client";

import {
  ProjectDTO,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
} from "@/lib/types";
import { FolderGit, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: ProjectDTO;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const statusColor = PROJECT_STATUS_COLORS[project.status];
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/projets/${project.id}`)}
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer",
        "bg-[rgba(10,10,18,0.5)] border",
        "transition-all duration-300",
        "hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]",
        "hover:-translate-y-0.5",
        "animate-fade-in-up",
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        borderColor: `${statusColor}30`,
      }}
      role="link"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${statusColor}50, transparent)`,
        }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `${statusColor}15`,
                borderColor: `${statusColor}30`,
              }}
            >
              <FolderGit className="w-5 h-5" style={{ color: statusColor }} />
            </div>
            <div>
              <h3 className="font-(family-name:--font-display) text-base font-medium text-white tracking-wide">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Status badge */}
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider border shrink-0"
            style={{
              backgroundColor: `${statusColor}15`,
              borderColor: `${statusColor}30`,
              color: statusColor,
            }}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Links */}
        {project.links.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">
              Liens & Ressources
            </p>
            <div className="flex flex-wrap gap-2">
              {project.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs",
                    "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]",
                    "text-[rgba(255,255,255,0.5)] hover:text-[#00f5ff]",
                    "hover:border-[rgba(0,245,255,0.3)] hover:bg-[rgba(0,245,255,0.05)]",
                    "transition-all duration-300",
                  )}
                >
                  <ExternalLink className="w-3 h-3" />
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Steps progress */}
        {project.steps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-2">
              <span>Plan</span>
              <span>
                {project.steps.filter((s) => s.completedAt).length} /{" "}
                {project.steps.length}
              </span>
            </div>
            <div className="flex gap-1">
              {project.steps.map((step) => (
                <div
                  key={step.id}
                  className="h-1 flex-1 rounded-full"
                  style={{
                    backgroundColor: step.completedAt
                      ? `${statusColor}80`
                      : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
