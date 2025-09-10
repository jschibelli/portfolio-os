import { ProjectMeta } from '../../../data/projects/types';
import { ExternalLinkIcon, GithubIcon, FileTextIcon } from 'lucide-react';

interface ProjectLinksProps {
  project: ProjectMeta;
}

export function ProjectLinks({ project }: ProjectLinksProps) {
  const links = [
    {
      label: 'Live Site',
      url: project.liveUrl,
      icon: ExternalLinkIcon,
      variant: 'default' as const,
    },
    {
      label: 'GitHub Repository',
      url: project.githubUrl,
      icon: GithubIcon,
      variant: 'outline' as const,
    },
    {
      label: 'Case Study',
      url: project.caseStudyUrl,
      icon: FileTextIcon,
      variant: 'secondary' as const,
    },
  ].filter(link => link.url);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
        Project Links
      </h3>
      
      <div className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.url}
              target={link.url?.startsWith('http') ? '_blank' : undefined}
              rel={link.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                link.variant === 'default'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200'
                  : link.variant === 'outline'
                  ? 'border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{link.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
