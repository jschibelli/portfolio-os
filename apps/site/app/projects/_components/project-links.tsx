'use client';

import { ProjectMeta } from '../../../data/projects/types';
import { ExternalLink, Github, FileText, BookOpen } from 'lucide-react';

interface ProjectLinksProps {
  project: ProjectMeta;
}

/**
 * Validates if a URL is safe and properly formatted
 * 
 * @param url - The URL string to validate
 * @returns true if the URL is valid and safe, false otherwise
 * 
 * @example
 * ```typescript
 * isValidUrl('https://example.com') // true
 * isValidUrl('/internal-page') // true (relative URL)
 * isValidUrl('javascript:alert(1)') // false (malicious)
 * isValidUrl('invalid-url') // false (invalid format)
 * ```
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // Check if it's a relative URL (always safe)
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return true;
  }
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    const isValidProtocol = ['http:', 'https:'].includes(urlObj.protocol);
    if (!isValidProtocol) {
      return false;
    }
    
    // Check for potentially malicious patterns
    const isNotMalicious = !urlObj.hostname.includes('javascript:') && 
                          !urlObj.hostname.includes('data:') &&
                          !urlObj.hostname.includes('vbscript:') &&
                          !urlObj.hostname.includes('file:') &&
                          !urlObj.href.includes('javascript:') &&
                          !urlObj.href.includes('data:');
    
    // Additional security checks
    const hasValidHostname = urlObj.hostname.length > 0 && 
                            !urlObj.hostname.includes('..') &&
                            !urlObj.hostname.includes('//');
    
    return isValidProtocol && isNotMalicious && hasValidHostname;
  } catch (error) {
    console.warn('URL validation failed for URL:', url, 'Error:', error);
    return false;
  }
}

/**
 * Checks if a URL is external (not same origin)
 * Works both on server and client side with comprehensive error handling
 * 
 * @param url - The URL string to check
 * @returns true if the URL is external, false if internal or invalid
 * 
 * @example
 * ```typescript
 * isExternalUrl('https://example.com') // true
 * isExternalUrl('/internal-page') // false
 * isExternalUrl('mailto:test@example.com') // false (non-http protocol)
 * isExternalUrl('invalid-url') // false (invalid URL)
 * ```
 */
function isExternalUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // Check if it's a relative URL first
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return false; // Relative URLs are not external
  }
  
  // Handle protocol-relative URLs (e.g., //example.com)
  if (url.startsWith('//')) {
    try {
      const urlObj = new URL(`https:${url}`);
      return urlObj.protocol === 'https:' && urlObj.hostname !== 'localhost';
    } catch (error) {
      console.warn('Invalid protocol-relative URL:', url, error);
      return false;
    }
  }
  
  try {
    const urlObj = new URL(url);
    
    // Only consider http/https protocols as external
    const isHttpProtocol = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    if (!isHttpProtocol) {
      return false; // Non-http protocols are not considered external
    }
    
    // On server side, assume external if it's absolute and not localhost
    if (typeof window === 'undefined') {
      return isHttpProtocol && 
             !urlObj.hostname.includes('localhost') && 
             !urlObj.hostname.includes('127.0.0.1') &&
             !urlObj.hostname.includes('::1');
    }
    return urlObj.origin !== window.location.origin;
  } catch (error) {
    console.warn('External URL check failed for URL:', url, 'Error:', error);
    return false; // Treat invalid URLs as non-external
  }
}

/**
 * Sanitizes URL to prevent XSS attacks
 */
function sanitizeUrl(url: string): string {
  // Leave relative URLs as-is
  if (url.startsWith('/') || url.startsWith('#')) return url;
  try {
    const urlObj = new URL(url);
    urlObj.search = '';
    urlObj.hash = '';
    return urlObj.toString();
  } catch {
    return url; // Return original URL if it's relative or malformed
  }
}

// Helper function to get link styling classes
const getLinkStyles = (variant: string, label: string): string => {
  const baseStyles = 'flex items-center gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900';
  
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

/**
 * ProjectLinks component displays project-related links with security validation and error handling.
 * Includes URL validation, security attributes, and accessibility improvements.
 */
export function ProjectLinks({ project }: ProjectLinksProps) {
  if (!project) {
    console.error('ProjectLinks: No project data provided');
    return null;
  }

  const links = [
    {
      label: 'Live Site',
      url: project.liveUrl,
      icon: ExternalLink,
      variant: 'default' as const,
    },
    {
      label: 'GitHub Repository',
      url: project.githubUrl,
      icon: Github,
      variant: 'outline' as const,
    },
    {
      label: 'Case Study',
      url: project.caseStudyUrl,
      icon: FileText,
      variant: 'secondary' as const,
    },
    {
      label: 'Documentation',
      url: project.documentationUrl,
      icon: BookOpen,
      variant: 'secondary' as const,
    },
  ]
    .filter(link => {
      if (!link.url) return false;
      const isValid = isValidUrl(link.url);
      if (!isValid) {
        console.warn(`Invalid URL filtered out: ${link.label} - ${link.url}`);
      }
      return isValid;
    })
    .map(link => ({
      ...link,
      url: sanitizeUrl(link.url!),
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
              className={getLinkStyles(link.variant, link.label)}
              role="listitem"
              aria-label={`${link.label}${isExternal ? ' (opens in new tab)' : ''}`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium">{link.label}</span>
              {isExternal && (
                <ExternalLink className="w-3 h-3 ml-auto" aria-hidden="true" />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
