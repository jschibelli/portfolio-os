// /lib/slugify.ts
// Utility functions for generating URL-friendly slugs

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateSlugFromTitle(title: string): string {
  return slugify(title)
}

export async function ensureUniqueSlug(
  slug: string,
  excludeId?: string
): Promise<string> {
  // This would typically check against your database
  // For now, we'll return the slug as-is
  // In a real implementation, you'd query your database here
  return slug
}


