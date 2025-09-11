import { ProjectMeta } from '../../../data/projects/types';
import Image from 'next/image';

interface ProjectContentProps {
  project: ProjectMeta;
}

export function ProjectContent({ project }: ProjectContentProps) {
  return (
    <section className="space-y-8">
      {/* Project Image */}
      {project.image && (
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={project.image}
            alt={`${project.title} project screenshot`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}

      {/* Project Details */}
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          Project Overview
        </h2>
        
        <div className="space-y-4 text-stone-600 dark:text-stone-400">
          {project.client && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Client:</strong> {project.client}
            </div>
          )}
          
          {project.industry && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Industry:</strong> {project.industry}
            </div>
          )}
          
          {project.category && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Category:</strong> {project.category.replace('-', ' ')}
            </div>
          )}
        </div>

        <p className="text-lg leading-relaxed">
          {project.description}
        </p>
      </div>
    </section>
  );
}
