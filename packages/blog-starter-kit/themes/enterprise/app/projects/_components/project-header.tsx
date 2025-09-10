import { ProjectMeta } from '../../../data/projects/types';
import { Badge } from '../../../components/ui/badge';
import { CalendarIcon, CodeIcon, ExternalLinkIcon, GithubIcon, UsersIcon } from 'lucide-react';

interface ProjectHeaderProps {
  project: ProjectMeta;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <header className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <Badge 
          variant={project.status === 'completed' ? 'default' : 'secondary'}
          className="text-sm font-medium"
        >
          {project.status.replace('-', ' ').toUpperCase()}
        </Badge>
        {project.featured && (
          <Badge variant="outline" className="text-sm font-medium border-amber-200 text-amber-800 dark:border-amber-800 dark:text-amber-200">
            Featured
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
        {project.title}
      </h1>

      {/* Description */}
      <p className="text-xl text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl">
        {project.description}
      </p>

      {/* Project Meta */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-stone-500 dark:text-stone-500">
        {project.startDate && project.endDate && (
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </span>
          </div>
        )}
        
        {project.duration && (
          <div className="flex items-center gap-2">
            <CodeIcon className="w-4 h-4" />
            <span>{project.duration}</span>
          </div>
        )}
        
        {project.teamSize && (
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            <span>{project.teamSize}</span>
          </div>
        )}
        
        {project.category && (
          <div className="flex items-center gap-2">
            <span className="capitalize">{project.category.replace('-', ' ')}</span>
          </div>
        )}
      </div>

      {/* Action Links */}
      <div className="flex flex-wrap gap-4 pt-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
          >
            <ExternalLinkIcon className="w-4 h-4" />
            View Live Site
          </a>
        )}
        
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            View Code
          </a>
        )}
        
        {project.caseStudyUrl && (
          <a
            href={project.caseStudyUrl}
            className="inline-flex items-center gap-2 px-6 py-3 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-lg font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          >
            Read Case Study
          </a>
        )}
      </div>
    </header>
  );
}
