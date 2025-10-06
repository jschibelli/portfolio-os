import { BlogPostSkeleton } from '../../../components/features/blog/blog-skeleton';

/**
 * Loading state for individual blog post pages
 * Shown while the page is being server-side rendered
 */
export default function BlogPostLoading() {
  return <BlogPostSkeleton />;
}
