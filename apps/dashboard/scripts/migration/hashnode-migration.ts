/**
 * Hashnode to Dashboard Migration Tool
 * Comprehensive migration system for content, metadata, and sync capabilities
 */

import { PrismaClient } from '@prisma/client';
import { createHashnodeClient, HashnodeClient } from '@mindware-blog/hashnode';
import { HashnodeArticle, HashnodeTag } from '@mindware-blog/hashnode/types';
import fs from 'fs/promises';
import path from 'path';

interface MigrationConfig {
  batchSize: number;
  dryRun: boolean;
  backupEnabled: boolean;
  syncEnabled: boolean;
  analyticsEnabled: boolean;
}

interface MigrationResult {
  success: boolean;
  imported: number;
  failed: number;
  skipped: number;
  errors: string[];
  analytics: MigrationAnalytics;
}

interface MigrationAnalytics {
  totalArticles: number;
  totalTags: number;
  totalSeries: number;
  averageContentLength: number;
  migrationDuration: number;
  successRate: number;
  contentTypes: Record<string, number>;
  tagDistribution: Record<string, number>;
}

interface BackupData {
  timestamp: string;
  articles: any[];
  tags: any[];
  series: any[];
  metadata: {
    totalArticles: number;
    totalTags: number;
    totalSeries: number;
  };
}

export class HashnodeMigrationTool {
  private prisma: PrismaClient;
  private hashnodeClient: HashnodeClient;
  private config: MigrationConfig;
  private analytics: MigrationAnalytics;

  constructor(config: Partial<MigrationConfig> = {}) {
    this.prisma = new PrismaClient();
    this.hashnodeClient = createHashnodeClient({
      apiToken: process.env.HASHNODE_API_TOKEN!,
      publicationId: process.env.HASHNODE_PUBLICATION_ID!,
    });
    this.config = {
      batchSize: 10,
      dryRun: false,
      backupEnabled: true,
      syncEnabled: true,
      analyticsEnabled: true,
      ...config,
    };
    this.analytics = this.initializeAnalytics();
  }

  private initializeAnalytics(): MigrationAnalytics {
    return {
      totalArticles: 0,
      totalTags: 0,
      totalSeries: 0,
      averageContentLength: 0,
      migrationDuration: 0,
      successRate: 0,
      contentTypes: {},
      tagDistribution: {},
    };
  }

  /**
   * Main migration entry point
   */
  async migrate(): Promise<MigrationResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let imported = 0;
    let failed = 0;
    let skipped = 0;

    try {
      console.log('🚀 Starting Hashnode to Dashboard migration...');
      
      // Create backup if enabled
      if (this.config.backupEnabled) {
        await this.createBackup();
      }

      // Test connections
      await this.testConnections();

      // Get all Hashnode articles
      const hashnodeArticles = await this.fetchAllHashnodeArticles();
      console.log(`📄 Found ${hashnodeArticles.length} articles to migrate`);

      // Process articles in batches
      for (let i = 0; i < hashnodeArticles.length; i += this.config.batchSize) {
        const batch = hashnodeArticles.slice(i, i + this.config.batchSize);
        console.log(`📦 Processing batch ${Math.floor(i / this.config.batchSize) + 1}/${Math.ceil(hashnodeArticles.length / this.config.batchSize)}`);

        for (const article of batch) {
          try {
            const result = await this.migrateArticle(article);
            if (result.success) {
              imported++;
            } else {
              failed++;
              errors.push(result.error || 'Unknown error');
            }
          } catch (error) {
            failed++;
            errors.push(`Article ${article.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      // Update analytics
      this.analytics.migrationDuration = Date.now() - startTime;
      this.analytics.successRate = imported / (imported + failed) * 100;

      console.log('✅ Migration completed');
      console.log(`📊 Results: ${imported} imported, ${failed} failed, ${skipped} skipped`);

      return {
        success: failed === 0,
        imported,
        failed,
        skipped,
        errors,
        analytics: this.analytics,
      };
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        imported,
        failed,
        skipped,
        errors: [...errors, error instanceof Error ? error.message : 'Unknown error'],
        analytics: this.analytics,
      };
    } finally {
      await this.prisma.$disconnect();
    }
  }

  /**
   * Migrate a single article from Hashnode to Dashboard
   */
  private async migrateArticle(hashnodeArticle: HashnodeArticle): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if article already exists
      const existingArticle = await this.prisma.article.findFirst({
        where: {
          OR: [
            { hashnodeId: hashnodeArticle.id },
            { slug: hashnodeArticle.slug },
          ],
        },
      });

      if (existingArticle && !this.config.dryRun) {
        console.log(`⏭️  Skipping existing article: ${hashnodeArticle.title}`);
        return { success: true };
      }

      if (this.config.dryRun) {
        console.log(`🔍 [DRY RUN] Would migrate: ${hashnodeArticle.title}`);
        return { success: true };
      }

      // Convert Hashnode article to Dashboard format
      const dashboardArticle = await this.convertHashnodeToDashboard(hashnodeArticle);

      // Create article in database
      const createdArticle = await this.prisma.article.create({
        data: dashboardArticle,
        include: {
          tags: true,
          series: true,
          author: true,
        },
      });

      console.log(`✅ Migrated: ${createdArticle.title}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to migrate article ${hashnodeArticle.title}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Convert Hashnode article format to Dashboard format
   */
  private async convertHashnodeToDashboard(hashnodeArticle: HashnodeArticle): Promise<any> {
    // Get or create author
    const author = await this.getOrCreateAuthor();

    // Process tags
    const tags = await this.processTags(hashnodeArticle.tags || []);

    // Process series
    const series = hashnodeArticle.series ? await this.processSeries(hashnodeArticle.series) : null;

    // Convert content format
    const contentJson = this.convertContentToJson(hashnodeArticle.content);

    return {
      title: hashnodeArticle.title,
      subtitle: hashnodeArticle.subtitle,
      slug: hashnodeArticle.slug,
      status: hashnodeArticle.isPublished ? 'PUBLISHED' : 'DRAFT',
      visibility: 'PUBLIC',
      excerpt: this.extractExcerpt(hashnodeArticle.content),
      authorId: author.id,
      seriesId: series?.id,
      contentJson,
      contentMdx: hashnodeArticle.content,
      publishedAt: hashnodeArticle.publishedAt,
      hashnodeId: hashnodeArticle.id,
      metaTitle: hashnodeArticle.metaTags?.title,
      metaDescription: hashnodeArticle.metaTags?.description,
      ogImageUrl: hashnodeArticle.metaTags?.image,
      allowComments: !hashnodeArticle.settings?.disableComments,
      allowReactions: true,
      readingMinutes: this.calculateReadingMinutes(hashnodeArticle.content),
      tags: {
        create: tags.map(tag => ({
          tag: {
            connect: { id: tag.id }
          }
        }))
      }
    };
  }

  /**
   * Process and create tags
   */
  private async processTags(hashnodeTags: HashnodeTag[]): Promise<any[]> {
    const processedTags = [];

    for (const tag of hashnodeTags) {
      let existingTag = await this.prisma.tag.findFirst({
        where: {
          OR: [
            { name: tag.name },
            { slug: tag.slug },
          ],
        },
      });

      if (!existingTag) {
        existingTag = await this.prisma.tag.create({
          data: {
            name: tag.name,
            slug: tag.slug,
          },
        });
      }

      processedTags.push(existingTag);
    }

    return processedTags;
  }

  /**
   * Process and create series
   */
  private async processSeries(series: { id: string; name: string }): Promise<any> {
    let existingSeries = await this.prisma.series.findFirst({
      where: { slug: this.slugify(series.name) },
    });

    if (!existingSeries) {
      existingSeries = await this.prisma.series.create({
        data: {
          title: series.name,
          slug: this.slugify(series.name),
        },
      });
    }

    return existingSeries;
  }

  /**
   * Get or create default author
   */
  private async getOrCreateAuthor(): Promise<any> {
    let author = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!author) {
      author = await this.prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'temp-password',
          role: 'ADMIN',
        },
      });
    }

    return author;
  }

  /**
   * Fetch all articles from Hashnode
   */
  private async fetchAllHashnodeArticles(): Promise<HashnodeArticle[]> {
    // This would use the Hashnode client to fetch all articles
    // Implementation depends on the specific Hashnode client API
    return [];
  }

  /**
   * Test database and Hashnode connections
   */
  private async testConnections(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`);
    }

    try {
      await this.hashnodeClient.testConnection();
      console.log('✅ Hashnode connection successful');
    } catch (error) {
      throw new Error(`Hashnode connection failed: ${error}`);
    }
  }

  /**
   * Create backup of existing data
   */
  private async createBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups', 'migration');
    
    await fs.mkdir(backupDir, { recursive: true });

    const articles = await this.prisma.article.findMany({
      include: { tags: true, series: true, author: true },
    });

    const tags = await this.prisma.tag.findMany();
    const series = await this.prisma.series.findMany();

    const backupData: BackupData = {
      timestamp,
      articles,
      tags,
      series,
      metadata: {
        totalArticles: articles.length,
        totalTags: tags.length,
        totalSeries: series.length,
      },
    };

    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2));

    console.log(`💾 Backup created: ${backupFile}`);
  }

  /**
   * Utility methods
   */
  private convertContentToJson(content: string): any {
    // Convert markdown content to JSON format for rich text editor
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        },
      ],
    };
  }

  private extractExcerpt(content: string, maxLength: number = 160): string {
    const plainText = content.replace(/[#*`]/g, '').trim();
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }

  private calculateReadingMinutes(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

/**
 * CLI interface for migration tool
 */
export async function runMigration(options: {
  dryRun?: boolean;
  batchSize?: number;
  backup?: boolean;
  sync?: boolean;
}) {
  const migrationTool = new HashnodeMigrationTool({
    dryRun: options.dryRun || false,
    batchSize: options.batchSize || 10,
    backupEnabled: options.backup !== false,
    syncEnabled: options.sync !== false,
  });

  const result = await migrationTool.migrate();
  
  console.log('\n📊 Migration Summary:');
  console.log(`✅ Successfully imported: ${result.imported}`);
  console.log(`❌ Failed: ${result.failed}`);
  console.log(`⏭️  Skipped: ${result.skipped}`);
  console.log(`⏱️  Duration: ${result.analytics.migrationDuration}ms`);
  console.log(`📈 Success rate: ${result.analytics.successRate.toFixed(2)}%`);

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }

  return result;
}

// Export for use in other modules
export { HashnodeMigrationTool, MigrationConfig, MigrationResult, MigrationAnalytics };

