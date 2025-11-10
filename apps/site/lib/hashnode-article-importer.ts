import { PrismaClient } from '@prisma/client';
import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'jschibelli';
const REPO_NAME = 'hashnode-schibelli';
const BRANCH = 'main';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

interface ArticleData {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  publishedAt: Date;
  status: 'PUBLISHED' | 'DRAFT';
}

export class HashnodeArticleImporter {
  private octokit: Octokit;

  constructor(private prisma: PrismaClient) {
    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    this.octokit = new Octokit({
      auth: GITHUB_TOKEN,
    });
  }

  async importArticles() {
    console.log('🚀 Starting Hashnode articles import...');

    const user = await this.getDefaultUser();
    if (!user) {
      throw new Error('No admin user found. Please create a user first.');
    }

    const files = await this.getMarkdownFiles();
    console.log(`📁 Found ${files.length} markdown files`);

    for (const file of files) {
      try {
        console.log(`\n📝 Processing: ${file.name}`);

        const content = await this.getFileContent(file.download_url);
        const articleData = await this.parseArticle(content, file.name);

        if (articleData) {
          await this.createArticle(articleData, user.id);
          console.log(`✅ Created article: ${articleData.title}`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${file.name}:`, error);
      }
    }

    console.log('\n🎉 Import completed successfully!');
  }

  private async getDefaultUser() {
    return await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
  }

  private async getMarkdownFiles(): Promise<GitHubFile[]> {
    const response = await this.octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: '',
      ref: BRANCH,
    });

    if (Array.isArray(response.data)) {
      return response.data.filter(
        (file) =>
          file.type === 'file' &&
          file.name.endsWith('.md') &&
          !file.name.startsWith('.'),
      );
    }

    return [];
  }

  private async getFileContent(downloadUrl: string): Promise<string> {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }

    return await response.text();
  }

  private async parseArticle(content: string, filename: string): Promise<ArticleData | null> {
    try {
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

      let metadata: Record<string, string> = {};
      let markdownContent = content;

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        markdownContent = frontmatterMatch[2];

        frontmatter.split('\n').forEach((line) => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            metadata[key.trim()] = value;
          }
        });
      }

      const title = metadata.title || this.generateTitleFromFilename(filename);

      const slug = metadata.slug || this.generateSlug(title);

      const tags = metadata.tags
        ? metadata.tags.split(',').map((tag: string) => tag.trim())
        : this.extractTagsFromContent(markdownContent);

      const excerpt = metadata.excerpt || this.generateExcerpt(markdownContent);

      const status = metadata.status === 'draft' ? 'DRAFT' : 'PUBLISHED';

      const publishedAt = metadata.publishedAt ? new Date(metadata.publishedAt) : new Date();

      return {
        title,
        content: markdownContent,
        excerpt,
        slug,
        tags,
        publishedAt,
        status,
      };
    } catch (error) {
      console.error(`Error parsing article ${filename}:`, error);
      return null;
    }
  }

  private generateTitleFromFilename(filename: string): string {
    const nameWithoutExt = filename.replace(/\.md$/, '');
    return nameWithoutExt
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private extractTagsFromContent(content: string): string[] {
    const tagPatterns = [
      /#(\w+)/g,
      /tags?:\s*([^\n]+)/gi,
      /categories?:\s*([^\n]+)/gi,
    ];

    const tags = new Set<string>();

    tagPatterns.forEach((pattern) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          if (pattern.source.includes('tags?') || pattern.source.includes('categories?')) {
            const values = match.split(':')[1]?.split(',').map((v) => v.trim()) || [];
            values.forEach((value) => tags.add(value));
          } else {
            const tag = match.replace('#', '');
            if (tag.length > 0) tags.add(tag);
          }
        });
      }
    });

    return Array.from(tags).slice(0, 10);
  }

  private generateExcerpt(content: string, maxLength: number = 160): string {
    const plainText = content
      .replace(/[#*`~\[\]()]/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  private async createArticle(articleData: ArticleData, authorId: string) {
    const existingArticle = await this.prisma.article.findUnique({
      where: { slug: articleData.slug },
    });

    if (existingArticle) {
      console.log(`⚠️ Article with slug "${articleData.slug}" already exists, skipping...`);
      return;
    }

    const tagIds = await this.createOrFindTags(articleData.tags);

    const article = await this.prisma.article.create({
      data: {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.excerpt,
        contentMdx: articleData.content,
        status: articleData.status,
        publishedAt: articleData.status === 'PUBLISHED' ? articleData.publishedAt : null,
        authorId,
        views: 0,
        readingMinutes: this.calculateReadingTime(articleData.content),
        featured: false,
        allowComments: true,
        paywalled: false,
        noindex: false,
        visibility: 'PUBLIC',
      },
    });

    if (tagIds.length > 0) {
      await this.prisma.articleTag.createMany({
        data: tagIds.map((tagId) => ({
          articleId: article.id,
          tagId,
        })),
      });
    }
  }

  private async createOrFindTags(tagNames: string[]): Promise<string[]> {
    const tagIds: string[] = [];

    for (const tagName of tagNames) {
      if (!tagName || tagName.trim().length === 0) {
        continue;
      }

      const normalizedName = tagName.trim().toLowerCase();
      const normalizedSlug = this.generateSlug(normalizedName);

      let tag = await this.prisma.tag.findUnique({
        where: { slug: normalizedSlug },
      });

      if (!tag) {
        tag = await this.prisma.tag.create({
          data: {
            name: tagName.trim(),
            slug: normalizedSlug,
          },
        });
      }

      tagIds.push(tag.id);
    }

    return tagIds;
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

export async function importArticlesWithoutDisconnect(prisma?: PrismaClient) {
  const prismaClient = prisma ?? new PrismaClient();

  try {
    const importer = new HashnodeArticleImporter(prismaClient);
    await importer.importArticles();
  } finally {
    if (!prisma) {
      await prismaClient.$disconnect();
    }
  }
}

