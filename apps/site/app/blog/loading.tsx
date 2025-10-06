import { BlogListSkeleton } from '../../components/features/blog/blog-skeleton';
import { Container } from '../../components/shared/container';
import ModernHero from '../../components/features/homepage/modern-hero';

/**
 * Loading state for the blog list page
 * Shown while the page is being server-side rendered
 */
export default function BlogLoading() {
  return (
    <div>
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-stone-900 dark:to-stone-800">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4">
            <div className="h-12 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-96 mx-auto" />
            <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-64 mx-auto" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-full max-w-2xl mx-auto" />
          </div>
        </div>
      </div>

      {/* Social Media Icons Skeleton */}
      <div className="bg-white py-8 dark:bg-stone-950">
        <Container className="px-5">
          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 w-12 bg-stone-200 dark:bg-stone-700 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content Skeleton */}
      <Container className="flex flex-col items-stretch gap-10 px-5 pb-10">
        <BlogListSkeleton />
      </Container>
    </div>
  );
}
