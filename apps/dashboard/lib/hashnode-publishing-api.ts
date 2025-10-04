/**
 * Hashnode Publishing API Integration
 * Server-side integration for publishing articles to Hashnode
 */

import { createHashnodeClient, HashnodeClient, HashnodeArticle } from '@mindware-blog/hashnode';

let hashnodeClient: HashnodeClient | null = null;

/**
 * Gets or creates a Hashnode client instance
 */
export function getHashnodeClient(): HashnodeClient {
  if (!hashnodeClient) {
    const apiToken = process.env.HASHNODE_API_TOKEN;
    const publicationId = process.env.HASHNODE_PUBLICATION_ID;

    if (!apiToken || !publicationId) {
      throw new Error(
        'Hashnode configuration missing. Please set HASHNODE_API_TOKEN and HASHNODE_PUBLICATION_ID environment variables.'
      );
    }

    hashnodeClient = createHashnodeClient({
      apiToken,
      publicationId,
    });
  }

  return hashnodeClient;
}

/**
 * Converts a dashboard article to Hashnode format
 */
export function convertToHashnodeArticle(article: any): HashnodeArticle {
  return {
    title: article.title,
    slug: article.slug,
    content: article.content || article.contentMarkdown || '',
    subtitle: article.excerpt || article.subtitle,
    coverImageUrl: article.coverImage || article.coverImageUrl,
    tags: article.tags?.map((tag: any) => ({
      id: tag.hashnodeId,
      name: tag.name,
      slug: tag.slug,
    })),
    series: article.seriesId
      ? {
          id: article.seriesId,
          name: article.series?.title || '',
        }
      : undefined,
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined,
    isPublished: article.status === 'PUBLISHED',
    metaTags: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      image: article.coverImage,
    },
    settings: {
      enableTableOfContents: true,
      disableComments: !article.allowComments,
      isNewsletterActivated: false,
      hideFromHashnodeFeed: article.visibility !== 'PUBLIC',
    },
  };
}

/**
 * Publishes an article to Hashnode
 */
export async function publishToHashnode(article: any): Promise<string> {
  try {
    const client = getHashnodeClient();
    const hashnodeArticle = convertToHashnodeArticle(article);

    // If article already has a Hashnode ID, update it
    if (article.hashnodeId) {
      const response = await client.updatePost(article.hashnodeId, hashnodeArticle);
      return response.updatePost.post.id;
    }

    // Otherwise, create a new post
    const response = await client.createPost(hashnodeArticle);
    return response.publishPost.post.id;
  } catch (error) {
    console.error('[Hashnode] Failed to publish article:', error);
    throw error;
  }
}

/**
 * Unpublishes an article from Hashnode
 */
export async function unpublishFromHashnode(hashnodeId: string): Promise<void> {
  try {
    const client = getHashnodeClient();
    await client.unpublishPost(hashnodeId);
  } catch (error) {
    console.error('[Hashnode] Failed to unpublish article:', error);
    throw error;
  }
}

/**
 * Deletes an article from Hashnode
 */
export async function deleteFromHashnode(hashnodeId: string): Promise<void> {
  try {
    const client = getHashnodeClient();
    await client.deletePost(hashnodeId);
  } catch (error) {
    console.error('[Hashnode] Failed to delete article:', error);
    throw error;
  }
}

/**
 * Schedules an article for publication on Hashnode
 */
export async function scheduleOnHashnode(hashnodeId: string, scheduledDate: Date): Promise<void> {
  try {
    const client = getHashnodeClient();
    await client.schedulePost(hashnodeId, scheduledDate);
  } catch (error) {
    console.error('[Hashnode] Failed to schedule article:', error);
    throw error;
  }
}

/**
 * Syncs article metadata with Hashnode
 */
export async function syncMetadataWithHashnode(hashnodeId: string, article: any): Promise<void> {
  try {
    const client = getHashnodeClient();
    const hashnodeArticle = convertToHashnodeArticle(article);
    await client.syncMetadata(hashnodeId, hashnodeArticle);
  } catch (error) {
    console.error('[Hashnode] Failed to sync metadata:', error);
    throw error;
  }
}

/**
 * Tests Hashnode connection
 */
export async function testHashnodeConnection(): Promise<boolean> {
  try {
    const client = getHashnodeClient();
    return await client.testConnection();
  } catch (error) {
    console.error('[Hashnode] Connection test failed:', error);
    return false;
  }
}

/**
 * Gets rate limit information
 */
export function getHashnodeRateLimitInfo() {
  try {
    const client = getHashnodeClient();
    return client.getRateLimitInfo();
  } catch (error) {
    return null;
  }
}

