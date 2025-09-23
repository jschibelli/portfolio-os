/**
 * QuickStats Component Usage Examples
 * 
 * This file demonstrates various ways to use the QuickStats component
 * with different data structures and configurations.
 */

import React from 'react';
import QuickStats, { ProjectMeta, createProjectMeta, createMixedProjectMeta } from './QuickStats';

// Example 1: Basic usage with predefined ProjectMeta array
export function BasicQuickStatsExample() {
  const projectMeta: ProjectMeta[] = [
    { label: 'Next.js', type: 'stack' },
    { label: 'TypeScript', type: 'stack' },
    { label: 'Tailwind CSS', type: 'stack' },
    { label: 'Frontend Developer', type: 'role' },
    { label: 'Active', type: 'status' },
    { label: '2024', type: 'year' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic QuickStats</h3>
      <QuickStats items={projectMeta} />
    </div>
  );
}

// Example 2: Using utility functions to create ProjectMeta
export function UtilityFunctionExample() {
  const stackTags = ['React', 'Next.js', 'TypeScript', 'Prisma'];
  const roleTags = ['Full-Stack Developer'];
  const statusTags = ['In Production'];
  const yearTags = ['2024'];

  // Using createProjectMeta for single type
  const stackMeta = createProjectMeta(stackTags, 'stack');
  
  // Using createMixedProjectMeta for multiple types
  const mixedMeta = createMixedProjectMeta(stackTags, roleTags, statusTags, yearTags);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Stack Only</h3>
        <QuickStats items={stackMeta} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Mixed Types</h3>
        <QuickStats items={mixedMeta} />
      </div>
    </div>
  );
}

// Example 3: Custom styling and variants
export function CustomStylingExample() {
  const customMeta: ProjectMeta[] = [
    { 
      label: 'React', 
      type: 'stack', 
      variant: 'default',
      className: 'bg-blue-100 text-blue-800'
    },
    { 
      label: 'Senior Developer', 
      type: 'role', 
      variant: 'secondary',
      className: 'bg-purple-100 text-purple-800'
    },
    { 
      label: 'Completed', 
      type: 'status', 
      variant: 'outline',
      className: 'border-green-500 text-green-700'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Custom Styling</h3>
      <QuickStats 
        items={customMeta} 
        className="bg-gray-50 p-4 rounded-lg"
        aria-label="Custom styled project badges"
      />
    </div>
  );
}

// Example 4: Integration with existing project data
export function ProjectIntegrationExample() {
  // Simulating data from portfolio.json or similar
  const projectData = {
    id: 'tendrilo',
    title: 'Tendril Multi-Tenant Chatbot SaaS',
    tags: ['Next.js', 'TypeScript', 'AI/ML', 'Multi-tenant', 'SaaS'],
    role: 'Lead Developer',
    status: 'In Development',
    year: '2024'
  };

  // Convert project data to ProjectMeta
  const projectMeta: ProjectMeta[] = [
    ...createProjectMeta(projectData.tags, 'stack'),
    { label: projectData.role, type: 'role' },
    { label: projectData.status, type: 'status' },
    { label: projectData.year, type: 'year' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{projectData.title}</h3>
      <QuickStats items={projectMeta} />
    </div>
  );
}

// Example 5: Different badge types showcase
export function BadgeTypesShowcase() {
  const showcaseMeta: ProjectMeta[] = [
    // Stack/Technology badges
    { label: 'React', type: 'stack' },
    { label: 'Node.js', type: 'technology' },
    
    // Role badges
    { label: 'Frontend Developer', type: 'role' },
    { label: 'UI/UX Designer', type: 'role' },
    
    // Status badges
    { label: 'Active', type: 'status' },
    { label: 'Completed', type: 'status' },
    
    // Year badges
    { label: '2024', type: 'year' },
    { label: '2023', type: 'year' },
    
    // Category badges
    { label: 'Web Application', type: 'category' },
    { label: 'Mobile App', type: 'category' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">All Badge Types</h3>
      <QuickStats items={showcaseMeta} />
    </div>
  );
}

// Example 6: Responsive and compact layout
export function ResponsiveExample() {
  const responsiveMeta: ProjectMeta[] = [
    { label: 'Next.js', type: 'stack' },
    { label: 'TypeScript', type: 'stack' },
    { label: 'Tailwind CSS', type: 'stack' },
    { label: 'Prisma', type: 'stack' },
    { label: 'Full-Stack', type: 'role' },
    { label: 'Active', type: 'status' },
    { label: '2024', type: 'year' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Responsive Layout</h3>
      <QuickStats 
        items={responsiveMeta} 
        className="flex-wrap gap-1 sm:gap-2"
      />
    </div>
  );
}

// Main example component that showcases all examples
export default function QuickStatsExamples() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">QuickStats Component Examples</h1>
        <p className="text-muted-foreground">
          Various usage patterns and configurations for the QuickStats component
        </p>
      </div>

      <BasicQuickStatsExample />
      <UtilityFunctionExample />
      <CustomStylingExample />
      <ProjectIntegrationExample />
      <BadgeTypesShowcase />
      <ResponsiveExample />
    </div>
  );
}
