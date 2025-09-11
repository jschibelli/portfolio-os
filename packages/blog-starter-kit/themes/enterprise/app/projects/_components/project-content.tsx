import { ProjectMeta } from '../../../data/projects/types';
import Image from 'next/image';

interface ProjectContentProps {
  project: ProjectMeta;
}

/**
 * ProjectContent component displays project information including image, client details, and description.
 * Includes error handling for missing data and accessibility improvements.
 */
export function ProjectContent({ project }: ProjectContentProps) {
  // Validate required project data
  if (!project) {
    console.error('ProjectContent: No project data provided');
    return (
      <section className="space-y-8" role="alert" aria-live="polite">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            Error: Project information is not available.
          </p>
        </div>
      </section>
    );
  }

  // Validate required fields
  if (!project.title || !project.description) {
    console.error('ProjectContent: Missing required project fields (title or description)');
    return (
      <section className="space-y-8" role="alert" aria-live="polite">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Warning: Project information is incomplete.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8" aria-labelledby="project-overview">
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
            onError={(e) => {
              console.error('Failed to load project image:', project.image);
              // Hide the image container on error
              const target = e.target as HTMLImageElement;
              const container = target.closest('.relative');
              if (container) {
                container.style.display = 'none';
              }
            }}
          />
        </div>
      )}

      {/* Project Details */}
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <h2 
          id="project-overview"
          className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4"
        >
          Project Overview
        </h2>
        
        <div className="space-y-4 text-stone-600 dark:text-stone-400">
          {project.client && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Client:</strong> 
              <span className="ml-2">{project.client}</span>
            </div>
          )}
          
          {project.industry && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Industry:</strong> 
              <span className="ml-2">{project.industry}</span>
            </div>
          )}
          
          {project.category && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Category:</strong> 
              <span className="ml-2">{project.category.replace('-', ' ')}</span>
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
