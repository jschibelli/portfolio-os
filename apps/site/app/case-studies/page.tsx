import { Metadata } from 'next';
import { PAGE_METADATA } from '../../lib/metadata';
import { CaseStudiesPageClient } from './case-studies-client';

export const metadata: Metadata = PAGE_METADATA.caseStudies;

export default function CaseStudiesPage() {
  return <CaseStudiesPageClient />;
}