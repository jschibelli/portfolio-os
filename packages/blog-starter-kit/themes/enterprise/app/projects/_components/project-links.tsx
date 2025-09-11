import { ProjectMeta } from '../../../data/projects/types';
import { ExternalLinkIcon, GithubIcon, FileTextIcon, BookOpenIcon } from 'lucide-react';

interface ProjectLinksProps {
  project: ProjectMeta;
}

// Helper function to get link styling classes
const getLinkStyles = (variant: string, label: string): string => {
  const baseStyles = 'flex items-center gap-3 p-3 rounded-lg transition-colors';
  
  switch (variant) {
    case 'default':
      return `${baseStyles} bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200`;
    case 'outline':
      return `${baseStyles} border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800`;
    case 'secondary':
      if (label === 'Documentation') {
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/30`;
      }
      return `${baseStyles} bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-300 dark:hover:bg-stone-700`;
    default:
      return `${baseStyles} bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-300 dark:hover:bg-stone-700`;
  }
};

// Helper function to validate URL
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    // Check if it's a relative URL
    return url.startsWith('/') || url.startsWith('#');
  }
};

export function ProjectLinks({ project }: ProjectLinksProps) {
  // Validate project prop
  if (!project) {
    console.warn('ProjectLinks: project prop is required');
    return null;
  }

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
    {
      label: 'Documentation',
      url: project.documentationUrl,
      icon: BookOpenIcon,
      variant: 'secondary' as const,
    },
  ].filter(link => isValidUrl(link.url));

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
          const isExternal = link.url?.startsWith('http');
          
          return (
            <a
              key={link.label}
              href={link.url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={getLinkStyles(link.variant, link.label)}
              aria-label={`${link.label} - ${isExternal ? 'Opens in new tab' : 'Internal link'}`}
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
