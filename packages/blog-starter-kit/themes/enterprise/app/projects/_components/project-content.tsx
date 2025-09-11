'use client';

import { ProjectMeta } from '../../../data/projects/types';
import Image from 'next/image';

interface ProjectContentProps {
  project: ProjectMeta;
}

/**
 * Sanitizes text content to prevent XSS attacks
 */
function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
}

/**
 * ProjectContent component displays project information including image, client details, and description.
 * Includes comprehensive error handling, accessibility improvements, and security measures.
 */
export function ProjectContent({ project }: ProjectContentProps) {
  // Validate required project data
  if (!project) {
    console.error('ProjectContent: No project data provided');
    return (
      <section className="space-y-8" role="alert" aria-live="polite">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Project Information Unavailable
          </h2>
          <p className="text-red-800 dark:text-red-200">
            We're sorry, but the project information is currently not available. Please try again later or contact support if the issue persists.
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
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Incomplete Project Information
          </h2>
          <p className="text-yellow-800 dark:text-yellow-200">
            Some project information appears to be incomplete. Please check back later for updated details.
          </p>
        </div>
      </section>
    );
  }

  // Sanitize project data to prevent XSS
  const sanitizedProject = {
    ...project,
    title: sanitizeText(project.title),
    description: sanitizeText(project.description),
    client: project.client ? sanitizeText(project.client) : undefined,
    industry: project.industry ? sanitizeText(project.industry) : undefined,
    category: project.category ? sanitizeText(project.category) : undefined,
  };

  return (
    <section className="space-y-8" aria-labelledby="project-overview">
      {/* Project Image */}
      {sanitizedProject.image && (
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
          <Image
            src={sanitizedProject.image}
            alt={`${sanitizedProject.title} project screenshot`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={(e) => {
              console.error('Failed to load project image:', sanitizedProject.image);
              // Hide the image container on error and show fallback
              const target = e.target as HTMLImageElement;
              const container = target.closest('.relative');
              if (container) {
                container.innerHTML = `
                  <div class="flex items-center justify-center h-full bg-stone-200 dark:bg-stone-700">
                    <p class="text-stone-500 dark:text-stone-400 text-sm">Image unavailable</p>
                  </div>
                `;
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
          {sanitizedProject.client && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Client:</strong> 
              <span className="ml-2">{sanitizedProject.client}</span>
            </div>
          )}
          
          {sanitizedProject.industry && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Industry:</strong> 
              <span className="ml-2">{sanitizedProject.industry}</span>
            </div>
          )}
          
          {sanitizedProject.category && (
            <div>
              <strong className="text-stone-900 dark:text-stone-100">Category:</strong> 
              <span className="ml-2">{sanitizedProject.category.replace('-', ' ')}</span>
            </div>
          )}
        </div>

        <p className="text-lg leading-relaxed">
          {sanitizedProject.description}
        </p>
      </div>
    </section>
  );
}
