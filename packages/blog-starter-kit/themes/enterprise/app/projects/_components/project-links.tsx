import { ProjectMeta } from '../../../data/projects/types';
import { ExternalLinkIcon, GithubIcon, FileTextIcon, BookOpenIcon } from 'lucide-react';

interface ProjectLinksProps {
  project: ProjectMeta;
}

/**
 * Validates if a URL is safe and properly formatted
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Checks if a URL is external (not same origin)
 */
function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * ProjectLinks component displays project-related links with security validation and error handling.
 * Includes URL validation, security attributes, and accessibility improvements.
 */
export function ProjectLinks({ project }: ProjectLinksProps) {
  // Validate project data
  if (!project) {
    console.error('ProjectLinks: No project data provided');
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
  ]
    .filter(link => link.url && isValidUrl(link.url)) // Filter out invalid URLs
    .map(link => ({
      ...link,
      isExternal: isExternalUrl(link.url!),
    }));

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
        Project Links
      </h3>
      
      <div className="space-y-3" role="list" aria-label="Project links">
        {links.map((link) => {
          const Icon = link.icon;
          const isExternal = link.isExternal;
          
          return (
            <a
              key={link.label}
              href={link.url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
                link.variant === 'default'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200'
                  : link.variant === 'outline'
                  ? 'border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800'
                  : link.label === 'Documentation'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
              role="listitem"
              aria-label={`${link.label}${isExternal ? ' (opens in new tab)' : ''}`}
              onError={(e) => {
                console.error(`Failed to load link: ${link.label}`, link.url);
                // Could add error handling here if needed
              }}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium">{link.label}</span>
              {isExternal && (
                <ExternalLinkIcon className="w-3 h-3 ml-auto" aria-hidden="true" />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
