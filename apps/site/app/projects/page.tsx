import { Metadata } from 'next';
import { PAGE_METADATA } from '../../lib/metadata';
import { ProjectsPageClient } from './projects-client';

export const metadata: Metadata = PAGE_METADATA.projects;

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}