/**
 * Skeleton loading components for blog pages
 * Provides visual feedback while blog content is loading
 */

export function BlogPostSkeleton() {
  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <header className="mb-8">
          {/* Cover Image Skeleton */}
          <div className="mb-6">
            <div className="w-full h-64 md:h-96 bg-stone-200 dark:bg-stone-700 rounded-lg animate-pulse" />
          </div>

          {/* Title Skeleton */}
          <div className="mb-4 space-y-3">
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-3/4" />
            <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-1/2" />
          </div>

          {/* Meta Information Skeleton */}
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-32" />
            <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-40" />
            <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-24" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2">
            <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded-full animate-pulse w-20" />
            <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded-full animate-pulse w-24" />
            <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded-full animate-pulse w-28" />
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-8">
          <div className="space-y-4">
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-full" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-full" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-full" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-4/5" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-full" />
            <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="space-y-12">
      {/* Featured Post Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-stone-800">
        <div className="h-96 bg-stone-200 dark:bg-stone-700 animate-pulse" />
        <div className="p-8 space-y-4">
          <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-full" />
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-5/6" />
          <div className="h-10 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-32 mt-4" />
        </div>
      </div>

      {/* Latest Posts Grid Skeleton */}
      <div className="space-y-6">
        <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-stone-800"
            >
              <div className="h-48 bg-stone-200 dark:bg-stone-700 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-full" />
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded animate-pulse w-4/5" />
                <div className="flex gap-2 mt-4">
                  <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded-full animate-pulse w-16" />
                  <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded-full animate-pulse w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
