import { getProject } from "@/actions/project";
import { ProjectDialog } from "@/components/journal/project-dialog";
import { ProjectSteps } from "@/components/journal/project-steps";
import { ProjectStatusSelect } from "@/components/journal/project-status-select";
import { DeleteProjectButton } from "@/components/journal/delete-project-button";
import { PROJECT_STATUS_COLORS } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FolderGit, ExternalLink, Edit } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjetPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  const statusColor = PROJECT_STATUS_COLORS[project.status];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/projets"
        className="inline-flex items-center gap-2 text-xs text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)] transition-colors mb-8 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Tous les projets
      </Link>

      {/* Header */}
      <header className="mb-10 relative">
        <div
          className="absolute -top-6 -left-6 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: statusColor }}
        />

        <div className="relative">
          {/* Top accent */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-px"
              style={{
                background: `linear-gradient(90deg, ${statusColor}, transparent)`,
              }}
            />
            <span
              className="text-[10px] font-medium tracking-[0.3em] uppercase"
              style={{ color: `${statusColor}99` }}
            >
              Projet
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0"
                style={{
                  backgroundColor: `${statusColor}15`,
                  borderColor: `${statusColor}30`,
                }}
              >
                <FolderGit className="w-6 h-6" style={{ color: statusColor }} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-(family-name:--font-display) text-4xl font-bold text-white tracking-tight leading-tight">
                  {project.title}
                </h1>
                <div className="mt-2">
                  <ProjectStatusSelect
                    projectId={project.id}
                    currentStatus={project.status}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <ProjectDialog projectToEdit={project}>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs border border-[rgba(123,184,139,0.3)] text-[rgba(123,184,139,0.7)] hover:bg-[rgba(123,184,139,0.1)] hover:text-[#7bb88b] transition-all">
                  <Edit className="w-3.5 h-3.5" />
                  Modifier
                </button>
              </ProjectDialog>
              <DeleteProjectButton projectId={project.id} />
            </div>
          </div>
        </div>
      </header>

      {/* Description */}
      {project.description && (
        <section className="mb-8">
          <p className="text-sm text-[rgba(255,255,255,0.6)] leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </section>
      )}

      {/* Links */}
      {project.links.length > 0 && (
        <section className="mb-8 p-5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,18,0.4)]">
          <p className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-3">
            Liens & Ressources
          </p>
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] hover:text-[#00f5ff] hover:border-[rgba(0,245,255,0.3)] hover:bg-[rgba(0,245,255,0.05)] transition-all duration-300"
              >
                <ExternalLink className="w-3 h-3" />
                {link.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent mb-8" />

      {/* Steps */}
      <section>
        <ProjectSteps
          projectId={project.id}
          initialSteps={project.steps}
          statusColor={statusColor}
        />
      </section>
    </div>
  );
}
