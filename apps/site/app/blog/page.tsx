import { Metadata } from 'next';
import { PAGE_METADATA } from '../../lib/metadata';
import { BlogPageClient } from './blog-client';

export const metadata: Metadata = PAGE_METADATA.blog;

export default function BlogPage() {
  return <BlogPageClient />;
}