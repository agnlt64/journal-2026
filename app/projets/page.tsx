import { getProjects } from "@/actions/project";
import { ProjectDialog } from "@/components/journal/project-dialog";
import { ProjectCard } from "@/components/journal/project-card";
import { FolderGit } from "lucide-react";
import {
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_ORDER,
  ProjectDTO,
} from "@/lib/types";

function groupProjectsByStatus(
  projects: ProjectDTO[],
): Map<ProjectDTO["status"], ProjectDTO[]> {
  const groups = new Map<ProjectDTO["status"], ProjectDTO[]>();

  for (const project of projects) {
    const statusGroup = groups.get(project.status);
    if (statusGroup) {
      statusGroup.push(project);
    } else {
      groups.set(project.status, [project]);
    }
  }

  return groups;
}

export default async function ProjetsPage() {
  const projects = await getProjects();
  const groupedProjects = groupProjectsByStatus(projects);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <header className="mb-12 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[rgba(123,184,139,0.03)] rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-linear-to-r from-[#7bb88b] to-transparent" />
            <span className="text-[10px] font-medium tracking-[0.3em] text-[rgba(123,184,139,0.6)] uppercase">
              Portfolio
            </span>
          </div>

          <div className="flex items-end justify-between">
            <h1 className="font-(family-name:--font-display) text-5xl font-bold text-white tracking-tight">
              PROJETS
            </h1>
            <ProjectDialog />
          </div>

          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <FolderGit className="w-4 h-4 text-[rgba(123,184,139,0.6)]" />
              <span className="text-sm text-[rgba(255,255,255,0.5)]">
                {projects.length}{" "}
                <span className="text-[rgba(255,255,255,0.3)]">projets</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Projects by Status */}
      <div className="space-y-10">
        {PROJECT_STATUS_ORDER.map((status) => {
          const statusProjects = groupedProjects.get(status);
          if (!statusProjects || statusProjects.length === 0) return null;

          return (
            <section key={status}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[rgba(123,184,139,0.1)] border border-[rgba(123,184,139,0.2)] flex items-center justify-center">
                  <FolderGit className="w-5 h-5" style={{ color: PROJECT_STATUS_COLORS[status] }}/>
                </div>
                <h2 className="font-(family-name:--font-display) text-lg font-medium text-white tracking-wide">
                  <span>
                    {PROJECT_STATUS_LABELS[status]}
                  </span>
                </h2>
                <div className="flex-1 h-px bg-linear-to-r from-[rgba(123,184,139,0.2)] to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statusProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center relative">
            <div className="absolute inset-0 bg-linear-to-b from-[rgba(123,184,139,0.02)] to-transparent rounded-3xl" />
            <div className="relative w-24 h-24 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center mb-6">
              <FolderGit className="w-10 h-10 text-[rgba(123,184,139,0.4)]" />
            </div>
            <h3 className="font-(family-name:--font-display) text-2xl text-white mb-2 tracking-wider">
              AUCUN PROJET
            </h3>
            <p className="text-[rgba(255,255,255,0.4)] text-sm max-w-md">
              Commencez à documenter vos idées et projets. Ajoutez des liens
              vers des ressources externes pour tout garder organisé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
