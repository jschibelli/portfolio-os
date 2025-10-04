import { Metadata } from 'next';
import { PAGE_METADATA } from '../../lib/metadata';
import { AboutPageClient } from './about-client';

export const metadata: Metadata = PAGE_METADATA.about;

export default function AboutPage() {
  return <AboutPageClient />;
} 