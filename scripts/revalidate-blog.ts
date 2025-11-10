#!/usr/bin/env tsx
/**
 * Force revalidation of blog pages
 * 
 * Usage:
 *   npx tsx scripts/revalidate-blog.ts
 *   npx tsx scripts/revalidate-blog.ts --slug your-post-slug
 * 
 * This script forces Next.js to revalidate the blog pages
 * by making requests to the revalidate API endpoints
 */

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const REVALIDATE_SECRET = process.env.CRON_SECRET || 'dev-secret';

async function revalidateBlog(slug?: string) {
  console.log('🔄 Forcing blog cache revalidation...\n');

  const paths = slug 
    ? [`/blog/${slug}`]
    : ['/blog'];

  for (const path of paths) {
    try {
      console.log(`  Revalidating: ${path}`);
      
      const url = `${SITE_URL}/api/revalidate?path=${encodeURIComponent(path)}&secret=${REVALIDATE_SECRET}`;
      const response = await fetch(url, { method: 'POST' });
      
      if (response.ok) {
        console.log(`  ✅ ${path} revalidated successfully`);
      } else {
        console.log(`  ⚠️  ${path} revalidation returned: ${response.status}`);
      }
    } catch (error) {
      console.error(`  ❌ Error revalidating ${path}:`, error);
    }
  }

  console.log('\n✨ Revalidation complete!\n');
  console.log('💡 Tips:');
  console.log('   - Wait a few seconds for cache to clear');
  console.log('   - Refresh your browser with Ctrl+Shift+R (hard refresh)');
  console.log('   - Or just wait 60 seconds for natural revalidation\n');
}

// Parse command line arguments
const args = process.argv.slice(2);
const slugIndex = args.indexOf('--slug');
const slug = slugIndex !== -1 && args[slugIndex + 1] ? args[slugIndex + 1] : undefined;

// Run revalidation
revalidateBlog(slug).catch(console.error);

