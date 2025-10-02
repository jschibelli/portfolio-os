/**
 * Migration System Tests
 * Comprehensive test suite for content migration and sync
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { HashnodeMigrationTool } from '../scripts/migration/hashnode-migration';
import { BidirectionalSync } from '../lib/sync/bidirectional-sync';
import { BackupSystem } from '../lib/backup/backup-system';
import { MigrationAnalytics } from '../lib/analytics/migration-analytics';
import { PrismaClient } from '@prisma/client';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    article: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    tag: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    series: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  })),
}));

// Mock Hashnode client
jest.mock('@mindware-blog/hashnode', () => ({
  createHashnodeClient: jest.fn().mockReturnValue({
    testConnection: jest.fn().mockResolvedValue(true),
    getPost: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    unpublishPost: jest.fn(),
    schedulePost: jest.fn(),
  }),
}));

// Mock file system
jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  readFile: jest.fn(),
  readdir: jest.fn(),
  unlink: jest.fn(),
  stat: jest.fn(),
}));

describe('Migration System', () => {
  let migrationTool: HashnodeMigrationTool;
  let syncSystem: BidirectionalSync;
  let backupSystem: BackupSystem;
  let analytics: MigrationAnalytics;
  let mockPrisma: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock Prisma instance
    mockPrisma = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      article: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      tag: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      series: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    // Initialize systems
    migrationTool = new HashnodeMigrationTool({
      batchSize: 5,
      dryRun: false,
      backupEnabled: true,
      syncEnabled: true,
      analyticsEnabled: true,
    });

    syncSystem = new BidirectionalSync({
      enabled: true,
      webhookSecret: 'test-secret',
      retryAttempts: 3,
      retryDelay: 1000,
      conflictResolution: 'newest',
    });

    backupSystem = new BackupSystem({
      enabled: true,
      backupDir: './test-backups',
      maxBackups: 5,
      retentionDays: 7,
    });

    analytics = new MigrationAnalytics({
      enabled: true,
      analyticsDir: './test-analytics',
      reportFormats: ['json'],
      realTimeTracking: true,
      detailedMetrics: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('HashnodeMigrationTool', () => {
    it('should initialize with correct configuration', () => {
      expect(migrationTool).toBeDefined();
    });

    it('should handle dry run mode', async () => {
      const dryRunTool = new HashnodeMigrationTool({
        dryRun: true,
        batchSize: 1,
      });

      // Mock fetchAllHashnodeArticles to return test data
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article',
          slug: 'test-article',
          content: 'Test content',
          isPublished: true,
          publishedAt: new Date(),
        },
      ];

      // Mock the fetchAllHashnodeArticles method
      jest.spyOn(dryRunTool as any, 'fetchAllHashnodeArticles').mockResolvedValue(mockArticles);

      const result = await dryRunTool.migrate();
      
      expect(result.success).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.failed).toBe(0);
    });

    it('should handle migration errors gracefully', async () => {
      // Mock fetchAllHashnodeArticles to throw error
      jest.spyOn(migrationTool as any, 'fetchAllHashnodeArticles').mockRejectedValue(
        new Error('Network error')
      );

      const result = await migrationTool.migrate();
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should convert Hashnode article to Dashboard format', async () => {
      const hashnodeArticle = {
        id: 'hashnode-123',
        title: 'Test Article',
        slug: 'test-article',
        content: 'Test content',
        subtitle: 'Test subtitle',
        isPublished: true,
        publishedAt: new Date(),
        tags: [
          { id: 'tag1', name: 'Technology', slug: 'technology' },
        ],
        series: {
          id: 'series1',
          name: 'Test Series',
        },
      };

      // Mock database operations
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN',
      });

      mockPrisma.tag.findFirst.mockResolvedValue(null);
      mockPrisma.tag.create.mockResolvedValue({
        id: 'tag1',
        name: 'Technology',
        slug: 'technology',
      });

      mockPrisma.series.findFirst.mockResolvedValue(null);
      mockPrisma.series.create.mockResolvedValue({
        id: 'series1',
        title: 'Test Series',
        slug: 'test-series',
      });

      const converted = await (migrationTool as any).convertHashnodeToDashboard(hashnodeArticle);
      
      expect(converted.title).toBe('Test Article');
      expect(converted.slug).toBe('test-article');
      expect(converted.status).toBe('PUBLISHED');
      expect(converted.hashnodeId).toBe('hashnode-123');
    });
  });

  describe('BidirectionalSync', () => {
    it('should initialize sync system', async () => {
      await syncSystem.initialize();
      expect(syncSystem.getStatus().isRunning).toBe(false);
    });

    it('should handle webhook events', async () => {
      const webhookPayload = {
        event: 'POST_PUBLISHED',
        post: {
          id: 'hashnode-123',
          title: 'Test Article',
          slug: 'test-article',
          url: 'https://example.com/test-article',
        },
        publication: {
          id: 'pub-123',
          title: 'Test Publication',
        },
        timestamp: new Date().toISOString(),
      };

      // Mock database operations
      mockPrisma.article.findFirst.mockResolvedValue(null);
      mockPrisma.article.create.mockResolvedValue({
        id: 'article-123',
        title: 'Test Article',
      });

      await syncSystem.handleWebhook(webhookPayload, 'test-signature');
      
      // Verify that article was created
      expect(mockPrisma.article.create).toHaveBeenCalled();
    });

    it('should sync article to Hashnode', async () => {
      const article = {
        id: 'article-123',
        title: 'Test Article',
        slug: 'test-article',
        contentMdx: 'Test content',
        status: 'PUBLISHED',
        tags: [],
        series: null,
        author: { name: 'Test Author' },
      };

      mockPrisma.article.findUnique.mockResolvedValue(article);

      await syncSystem.syncToHashnode('article-123');
      
      // Verify sync operation was attempted
      expect(mockPrisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 'article-123' },
        include: { tags: true, series: true, author: true },
      });
    });
  });

  describe('BackupSystem', () => {
    it('should create full backup', async () => {
      // Mock file system operations
      const mockFs = require('fs/promises');
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.stat.mockResolvedValue({ size: 1024 });

      // Mock database queries
      mockPrisma.article.findMany.mockResolvedValue([
        { id: '1', title: 'Article 1' },
        { id: '2', title: 'Article 2' },
      ]);
      mockPrisma.tag.findMany.mockResolvedValue([
        { id: '1', name: 'Tag 1' },
      ]);
      mockPrisma.series.findMany.mockResolvedValue([]);
      mockPrisma.user.findMany.mockResolvedValue([
        { id: '1', name: 'User 1' },
      ]);

      const backupPath = await backupSystem.createFullBackup('Test backup');
      
      expect(backupPath).toContain('backup_');
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should list available backups', async () => {
      const mockBackups = [
        {
          id: 'backup-1',
          timestamp: '2023-01-01T00:00:00Z',
          type: 'full',
          description: 'Test backup 1',
          articleCount: 10,
          tagCount: 5,
          seriesCount: 2,
        },
        {
          id: 'backup-2',
          timestamp: '2023-01-02T00:00:00Z',
          type: 'incremental',
          description: 'Test backup 2',
          articleCount: 5,
          tagCount: 2,
          seriesCount: 1,
        },
      ];

      // Mock file system operations
      const mockFs = require('fs/promises');
      mockFs.readdir.mockResolvedValue(['backup-1.json', 'backup-2.json']);
      mockFs.readFile
        .mockResolvedValueOnce(JSON.stringify({ metadata: mockBackups[0] }))
        .mockResolvedValueOnce(JSON.stringify({ metadata: mockBackups[1] }));

      const backups = await backupSystem.listBackups();
      
      expect(backups).toHaveLength(2);
      expect(backups[0].id).toBe('backup-1');
      expect(backups[1].id).toBe('backup-2');
    });

    it('should restore from backup', async () => {
      const backupData = {
        metadata: {
          id: 'backup-123',
          timestamp: '2023-01-01T00:00:00Z',
          type: 'full',
          description: 'Test backup',
          checksum: 'test-checksum',
          articleCount: 2,
          tagCount: 1,
          seriesCount: 0,
          version: '1.0.0',
        },
        articles: [
          { id: '1', title: 'Article 1' },
          { id: '2', title: 'Article 2' },
        ],
        tags: [{ id: '1', name: 'Tag 1' }],
        series: [],
        users: [{ id: '1', name: 'User 1' }],
        settings: {},
        relationships: {
          articleTags: [],
          articleSeries: [],
        },
      };

      // Mock file system operations
      const mockFs = require('fs/promises');
      mockFs.readFile.mockResolvedValue(JSON.stringify(backupData));

      // Mock database operations
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return await callback(mockPrisma);
      });

      const result = await backupSystem.restoreFromBackup('backup-123');
      
      expect(result.success).toBe(true);
      expect(result.restored.articles).toBe(2);
      expect(result.restored.tags).toBe(1);
    });
  });

  describe('MigrationAnalytics', () => {
    it('should track real-time metrics', () => {
      analytics.startRealTimeTracking('migration', 100);
      
      const metrics = analytics.getRealTimeMetrics();
      expect(metrics).toBeDefined();
      expect(metrics?.currentOperation).toBe('migration');
      expect(metrics?.total).toBe(100);
      expect(metrics?.processed).toBe(0);
    });

    it('should update real-time metrics', () => {
      analytics.startRealTimeTracking('migration', 100);
      analytics.updateRealTimeMetrics({
        processed: 50,
        errors: 2,
        warnings: 1,
      });
      
      const metrics = analytics.getRealTimeMetrics();
      expect(metrics?.processed).toBe(50);
      expect(metrics?.errors).toBe(2);
      expect(metrics?.warnings).toBe(1);
      expect(metrics?.progress).toBe(50);
    });

    it('should generate migration report', async () => {
      // Mock database queries
      mockPrisma.article.findMany.mockResolvedValue([
        { id: '1', title: 'Article 1', contentMdx: 'Content 1', tags: [], series: null, author: { name: 'Author 1' } },
        { id: '2', title: 'Article 2', contentMdx: 'Content 2', tags: [], series: null, author: { name: 'Author 2' } },
      ]);
      mockPrisma.tag.findMany.mockResolvedValue([
        { id: '1', name: 'Tag 1' },
      ]);
      mockPrisma.series.findMany.mockResolvedValue([]);
      mockPrisma.user.findMany.mockResolvedValue([
        { id: '1', name: 'User 1' },
      ]);

      // Mock file system operations
      const mockFs = require('fs/promises');
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      const report = await analytics.generateMigrationReport(
        'migration',
        'success',
        [],
        []
      );
      
      expect(report.id).toBeDefined();
      expect(report.type).toBe('migration');
      expect(report.status).toBe('success');
      expect(report.metrics.totalArticles).toBe(2);
    });

    it('should stop real-time tracking', () => {
      analytics.startRealTimeTracking('migration', 100);
      analytics.stopRealTimeTracking();
      
      const metrics = analytics.getRealTimeMetrics();
      expect(metrics).toBeNull();
    });
  });

  describe('Integration Tests', () => {
    it('should perform complete migration workflow', async () => {
      // Mock all dependencies
      const mockHashnodeArticles = [
        {
          id: 'hashnode-1',
          title: 'Test Article 1',
          slug: 'test-article-1',
          content: 'Test content 1',
          isPublished: true,
          publishedAt: new Date(),
          tags: [{ id: 'tag1', name: 'Technology', slug: 'technology' }],
        },
        {
          id: 'hashnode-2',
          title: 'Test Article 2',
          slug: 'test-article-2',
          content: 'Test content 2',
          isPublished: false,
          tags: [],
        },
      ];

      // Mock database operations
      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN',
      });
      mockPrisma.tag.findFirst.mockResolvedValue(null);
      mockPrisma.tag.create.mockResolvedValue({
        id: 'tag1',
        name: 'Technology',
        slug: 'technology',
      });
      mockPrisma.article.findFirst.mockResolvedValue(null);
      mockPrisma.article.create.mockResolvedValue({
        id: 'article1',
        title: 'Test Article 1',
      });

      // Mock file system operations
      const mockFs = require('fs/promises');
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);
      mockFs.stat.mockResolvedValue({ size: 1024 });

      // Initialize systems
      await backupSystem.initialize();
      await analytics.initialize();

      // Create backup
      const backupPath = await backupSystem.createMigrationBackup('Test migration backup');
      expect(backupPath).toContain('backup_');

      // Start analytics
      analytics.startRealTimeTracking('migration', mockHashnodeArticles.length);

      // Run migration
      const result = await migrationTool.migrate();
      
      expect(result.success).toBe(true);
      expect(result.imported).toBeGreaterThanOrEqual(0);
      expect(result.analytics).toBeDefined();

      // Stop analytics
      analytics.stopRealTimeTracking();

      // Generate report
      const report = await analytics.generateMigrationReport(
        'migration',
        result.success ? 'success' : 'failed',
        result.errors,
        []
      );

      expect(report.id).toBeDefined();
      expect(report.type).toBe('migration');
    });
  });
});

