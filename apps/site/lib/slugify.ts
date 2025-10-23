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
  // Import prisma here to avoid circular dependencies
  const { prisma } = await import('@/lib/prisma')
  
  let uniqueSlug = slug
  let counter = 1
  
  while (true) {
    const existingArticle = await prisma.article.findUnique({
      where: { slug: uniqueSlug }
    })
    
    // If no existing article, or if it's the same article we're updating
    if (!existingArticle || (excludeId && existingArticle.id === excludeId)) {
      break
    }
    
    // Generate a new slug with a counter
    uniqueSlug = `${slug}-${counter}`
    counter++
  }
  
  return uniqueSlug
}

