'use client';

import { ProjectMeta } from '../../../data/projects/types';
import { Badge } from '../../../components/ui/badge';

interface ProjectTechnologiesProps {
  project: ProjectMeta;
}

/**
 * ProjectTechnologies component displays the technologies used in a project.
 * Includes error handling for missing data and accessibility improvements.
 */
export function ProjectTechnologies({ project }: ProjectTechnologiesProps) {
  // Validate project data
  if (!project) {
    console.error('ProjectTechnologies: No project data provided');
    return null;
  }

  // Validate technologies array
  if (!project.technologies || !Array.isArray(project.technologies) || project.technologies.length === 0) {
    console.warn('ProjectTechnologies: No technologies data available for project:', project.title);
    return (
      <section className="space-y-6" aria-labelledby="technologies-heading">
        <h2 
          id="technologies-heading"
          className="text-2xl font-bold text-stone-900 dark:text-stone-100"
        >
          Technologies Used
        </h2>
        <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4">
          <p className="text-stone-600 dark:text-stone-400 italic">
            Technology information is not available for this project.
          </p>
        </div>
      </section>
    );
  }

  // Filter out empty or invalid technology entries
  const validTechnologies = project.technologies.filter(tech => 
    tech && typeof tech === 'string' && tech.trim().length > 0
  );

  if (validTechnologies.length === 0) {
    return (
      <section className="space-y-6" aria-labelledby="technologies-heading">
        <h2 
          id="technologies-heading"
          className="text-2xl font-bold text-stone-900 dark:text-stone-100"
        >
          Technologies Used
        </h2>
        <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4">
          <p className="text-stone-600 dark:text-stone-400 italic">
            No valid technology information available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="technologies-heading">
      <h2 
        id="technologies-heading"
        className="text-2xl font-bold text-stone-900 dark:text-stone-100"
      >
        Technologies Used
      </h2>
      
      <div 
        className="flex flex-wrap gap-3" 
        role="list" 
        aria-label="Technologies used in this project"
      >
        {validTechnologies.map((tech, index) => (
          <Badge
            key={`${tech}-${index}`}
            className="text-sm font-medium border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900"
            role="listitem"
            aria-label={`Technology: ${tech}`}
          >
            {tech.trim()}
          </Badge>
        ))}
      </div>
    </section>
  );
}
