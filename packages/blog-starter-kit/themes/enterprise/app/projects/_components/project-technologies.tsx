import { ProjectMeta } from '../../../data/projects/types';
import { Badge } from '../../../components/ui/badge';

interface ProjectTechnologiesProps {
  project: ProjectMeta;
}

export function ProjectTechnologies({ project }: ProjectTechnologiesProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
        Technologies Used
      </h2>
      
      <div className="flex flex-wrap gap-3">
        {project.technologies.map((tech) => (
          <Badge 
            key={tech} 
            variant="outline" 
            className="text-sm font-medium border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            {tech}
          </Badge>
        ))}
      </div>
    </section>
  );
}
