#!/usr/bin/env tsx

/**
 * Publish Blog Post to Hashnode
 * 
 * This script publishes a markdown blog post to Hashnode using their GraphQL API
 * 
 * Usage: npx tsx scripts/publish-blog-to-hashnode.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { createHashnodeClient } from '../packages/hashnode';
import type { HashnodeArticle } from '../packages/hashnode/types';

// Environment variables (these should be set in your environment)
const HASHNODE_API_TOKEN = process.env.HASHNODE_API_TOKEN;
const HASHNODE_PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID;

if (!HASHNODE_API_TOKEN) {
  console.error('❌ HASHNODE_API_TOKEN environment variable is not set');
  console.error('   Get your token from: https://hashnode.com/settings/developer');
  process.exit(1);
}

if (!HASHNODE_PUBLICATION_ID) {
  console.error('❌ HASHNODE_PUBLICATION_ID environment variable is not set');
  console.error('   Get your publication ID from your Hashnode publication settings');
  process.exit(1);
}

interface FrontMatter {
  title: string;
  slug: string;
  subtitle?: string;
  coverImage?: string;
  publishedAt?: string;
  isPublished?: boolean;
  tags?: Array<{ name: string; slug: string }>;
  metaTags?: {
    title?: string;
    description?: string;
    image?: string;
  };
  settings?: {
    enableTableOfContents?: boolean;
    disableComments?: boolean;
    isNewsletterActivated?: boolean;
  };
}

/**
 * Parse frontmatter from markdown
 */
function parseFrontMatter(content: string): { frontMatter: FrontMatter; content: string } {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    throw new Error('No frontmatter found in markdown file');
  }

  const frontMatterText = match[1];
  const markdownContent = match[2];

  // Simple YAML parser (basic implementation)
  const frontMatter: any = {};
  let currentKey = '';
  let currentArray: any[] = [];
  let currentObject: any = {};
  let inArray = false;
  let inObject = false;

  frontMatterText.split('\n').forEach((line) => {
    // Skip empty lines
    if (!line.trim()) return;

    // Check for key-value pair
    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyValueMatch && !line.startsWith(' ')) {
      // Save previous array or object if exists
      if (inArray && currentKey) {
        frontMatter[currentKey] = currentArray;
        currentArray = [];
        inArray = false;
      }
      if (inObject && currentKey) {
        frontMatter[currentKey] = currentObject;
        currentObject = {};
        inObject = false;
      }

      const [, key, value] = keyValueMatch;
      currentKey = key;

      if (value) {
        // Single value
        frontMatter[key] = parseValue(value);
      }
      // If no value, it might be an array or object
    } else if (line.trim().startsWith('-')) {
      // Array item
      inArray = true;
      const value = line.trim().substring(1).trim();
      
      // Check if it's an object in array
      if (value.includes(':')) {
        const objMatch = value.match(/(\w+):\s*"?([^"]+)"?/);
        if (objMatch) {
          const [, objKey, objValue] = objMatch;
          const lastItem = currentArray[currentArray.length - 1];
          if (lastItem && typeof lastItem === 'object') {
            lastItem[objKey] = parseValue(objValue);
          } else {
            currentArray.push({ [objKey]: parseValue(objValue) });
          }
        }
      } else {
        currentArray.push(parseValue(value));
      }
    } else if (line.trim().match(/^\w+:/)) {
      // Object property
      inObject = true;
      const propMatch = line.trim().match(/^(\w+):\s*(.*)$/);
      if (propMatch) {
        const [, key, value] = propMatch;
        currentObject[key] = parseValue(value);
      }
    }
  });

  // Save last array or object
  if (inArray && currentKey) {
    frontMatter[currentKey] = currentArray;
  }
  if (inObject && currentKey) {
    frontMatter[currentKey] = currentObject;
  }

  return { frontMatter: frontMatter as FrontMatter, content: markdownContent };
}

/**
 * Parse a value from YAML
 */
function parseValue(value: string): any {
  value = value.trim();
  
  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Number
  if (!isNaN(Number(value)) && value !== '') return Number(value);

  // String
  return value;
}

/**
 * Main function
 */
async function main() {
  console.log('📝 Publishing blog post to Hashnode...\n');

  // Read the markdown file
  const blogPostPath = join(process.cwd(), 'apps/site/content/blog/multi-agent-development-workflow.md');
  console.log(`📂 Reading file: ${blogPostPath}`);
  
  const fileContent = readFileSync(blogPostPath, 'utf-8');
  
  // Parse frontmatter and content
  const { frontMatter, content } = parseFrontMatter(fileContent);
  console.log(`✅ Parsed frontmatter and content\n`);

  // Display what we're about to publish
  console.log('📋 Post Details:');
  console.log(`   Title: ${frontMatter.title}`);
  console.log(`   Slug: ${frontMatter.slug}`);
  console.log(`   Subtitle: ${frontMatter.subtitle || 'N/A'}`);
  console.log(`   Tags: ${frontMatter.tags?.map(t => t.name).join(', ') || 'N/A'}`);
  console.log(`   Content length: ${content.length} characters`);
  console.log('');

  // Create Hashnode client
  const client = createHashnodeClient({
    apiToken: HASHNODE_API_TOKEN!,
    publicationId: HASHNODE_PUBLICATION_ID!,
  });

  // Test connection
  console.log('🔌 Testing Hashnode connection...');
  const isConnected = await client.testConnection();
  if (!isConnected) {
    console.error('❌ Failed to connect to Hashnode API');
    console.error('   Please check your API token and publication ID');
    process.exit(1);
  }
  console.log('✅ Connected to Hashnode\n');

  // Prepare article data
  const article: HashnodeArticle = {
    title: frontMatter.title,
    slug: frontMatter.slug,
    content: content.trim(),
    subtitle: frontMatter.subtitle,
    coverImageUrl: frontMatter.coverImage,
    tags: frontMatter.tags,
    publishedAt: frontMatter.publishedAt ? new Date(frontMatter.publishedAt) : new Date(),
    isPublished: frontMatter.isPublished !== false, // Default to true
    metaTags: frontMatter.metaTags,
    settings: frontMatter.settings,
  };

  // Publish the post
  console.log('🚀 Publishing post to Hashnode...');
  try {
    const response = await client.createPost(article);
    
    console.log('\n✅ Successfully published to Hashnode!');
    console.log('');
    console.log('📊 Published Post Details:');
    console.log(`   Post ID: ${response.publishPost.post.id}`);
    console.log(`   Title: ${response.publishPost.post.title}`);
    console.log(`   Slug: ${response.publishPost.post.slug}`);
    console.log(`   URL: ${response.publishPost.post.url}`);
    console.log(`   Published At: ${response.publishPost.post.publishedAt || 'Now'}`);
    console.log('');
    console.log(`🎉 View your post at: ${response.publishPost.post.url}`);
    
  } catch (error) {
    console.error('\n❌ Failed to publish post:', error);
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});






