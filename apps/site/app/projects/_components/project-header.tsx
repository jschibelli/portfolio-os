import { ProjectMeta } from '../../../data/projects/types';
import { Badge } from '../../../components/ui/badge';
import { CalendarIcon, CodeIcon, ExternalLinkIcon, GithubIcon, UsersIcon, FileTextIcon, BookOpenIcon } from 'lucide-react';

interface ContextualButton {
  label: string;
  url: string;
  icon?: any;
  external: boolean;
  className: string;
}

interface ProjectHeaderProps {
  project: ProjectMeta;
}

// Smart contextual button selection based on project type and available links
function getContextualHeaderButtons(project: ProjectMeta): ContextualButton[] {
  const buttons: ContextualButton[] = [];
  
  // Define button configurations
  const buttonConfigs = {
    liveSite: {
      label: 'View Live Site',
      url: project.liveUrl!,
      icon: ExternalLinkIcon,
      external: true,
      className: 'inline-flex items-center gap-2 px-6 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors'
    },
    caseStudy: {
      label: 'Read Case Study',
      url: project.caseStudyUrl!,
      icon: FileTextIcon,
      external: false,
      className: 'inline-flex items-center gap-2 px-6 py-3 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-lg font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors'
    },
    documentation: {
      label: 'Documentation',
      url: project.documentationUrl!,
      icon: BookOpenIcon,
      external: true,
      className: 'inline-flex items-center gap-2 px-6 py-3 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'
    },
    viewCode: {
      label: 'View Code',
      url: project.githubUrl!,
      icon: GithubIcon,
      external: true,
      className: 'inline-flex items-center gap-2 px-6 py-3 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors'
    }
  };

  // Priority-based selection logic - only add buttons if URLs exist
  // 1. Live Site (highest priority for user-facing projects)
  if (project.liveUrl) {
    buttons.push(buttonConfigs.liveSite);
  }
  
  // 2. Case Study (high priority for portfolio projects)
  if (project.caseStudyUrl) {
    buttons.push(buttonConfigs.caseStudy);
  }
  
  // 3. Documentation (for technical projects without case studies)
  if (project.documentationUrl && !project.caseStudyUrl) {
    buttons.push(buttonConfigs.documentation);
  }
  
  // 4. View Code (for open source or when no live site)
  if (project.githubUrl && !project.liveUrl) {
    buttons.push(buttonConfigs.viewCode);
  }
  
  // If we have less than 2 buttons, add GitHub as a secondary action (only if it exists and not already added)
  if (buttons.length < 2 && project.githubUrl && !buttons.some(b => b.url === project.githubUrl)) {
    buttons.push(buttonConfigs.viewCode);
  }
  
  // Limit to 3 buttons maximum for clean layout
  return buttons.slice(0, 3);
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
          className="text-sm font-medium"
        >
          {project.status.replace('-', ' ').toUpperCase()}
        </Badge>
        {project.featured && (
          <Badge className="text-sm font-medium border-amber-200 text-amber-800 dark:border-amber-800 dark:text-amber-200">
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

      {/* Action Links - Context-Aware Selection */}
      {getContextualHeaderButtons(project).length > 0 && (
        <div className="flex flex-wrap gap-4 pt-4">
          {getContextualHeaderButtons(project).map((button, index) => (
            <a
              key={index}
              href={button.url}
              target={button.external ? '_blank' : undefined}
              rel={button.external ? 'noopener noreferrer' : undefined}
              className={button.className}
            >
              {button.icon && <button.icon className="w-4 h-4" />}
              {button.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
