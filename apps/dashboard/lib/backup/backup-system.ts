/**
 * Content Backup and Rollback System
 * Comprehensive backup system with versioning and rollback capabilities
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createHash } from 'crypto';

interface BackupConfig {
  enabled: boolean;
  backupDir: string;
  maxBackups: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  encryptionKey?: string;
  retentionDays: number;
}

interface BackupMetadata {
  id: string;
  timestamp: string;
  type: 'full' | 'incremental' | 'migration' | 'sync';
  description: string;
  size: number;
  checksum: string;
  articleCount: number;
  tagCount: number;
  seriesCount: number;
  version: string;
}

interface BackupData {
  metadata: BackupMetadata;
  articles: any[];
  tags: any[];
  series: any[];
  users: any[];
  settings: any;
  relationships: {
    articleTags: any[];
    articleSeries: any[];
  };
}

interface RollbackResult {
  success: boolean;
  restored: {
    articles: number;
    tags: number;
    series: number;
    users: number;
  };
  errors: string[];
  warnings: string[];
}

export class BackupSystem {
  private prisma: PrismaClient;
  private config: BackupConfig;
  private backupDir: string;

  constructor(config: Partial<BackupConfig> = {}) {
    this.prisma = new PrismaClient();
    this.config = {
      enabled: true,
      backupDir: path.join(process.cwd(), 'backups'),
      maxBackups: 10,
      compressionEnabled: true,
      encryptionEnabled: false,
      retentionDays: 30,
      ...config,
    };
    this.backupDir = this.config.backupDir;
  }

  /**
   * Initialize backup system
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('💾 Backup system disabled');
      return;
    }

    console.log('💾 Initializing backup system...');
    
    // Create backup directory
    await fs.mkdir(this.backupDir, { recursive: true });
    
    // Clean old backups
    await this.cleanOldBackups();
    
    console.log('✅ Backup system initialized');
  }

  /**
   * Create full backup
   */
  async createFullBackup(description: string = 'Full backup'): Promise<string> {
    console.log('💾 Creating full backup...');
    
    const backupId = this.generateBackupId();
    const timestamp = new Date().toISOString();
    
    // Fetch all data
    const [articles, tags, series, users, settings] = await Promise.all([
      this.prisma.article.findMany({
        include: { tags: true, series: true, author: true, cover: true },
      }),
      this.prisma.tag.findMany(),
      this.prisma.series.findMany(),
      this.prisma.user.findMany(),
      this.getSettings(),
    ]);

    // Fetch relationships
    const relationships = await this.getRelationships();

    const backupData: BackupData = {
      metadata: {
        id: backupId,
        timestamp,
        type: 'full',
        description,
        size: 0, // Will be calculated after compression
        checksum: '',
        articleCount: articles.length,
        tagCount: tags.length,
        seriesCount: series.length,
        version: await this.getDatabaseVersion(),
      },
      articles,
      tags,
      series,
      users,
      settings,
      relationships,
    };

    // Calculate checksum
    backupData.metadata.checksum = this.calculateChecksum(backupData);

    // Save backup
    const backupPath = await this.saveBackup(backupData);
    
    console.log(`✅ Full backup created: ${backupPath}`);
    return backupPath;
  }

  /**
   * Create incremental backup
   */
  async createIncrementalBackup(description: string = 'Incremental backup'): Promise<string> {
    console.log('💾 Creating incremental backup...');
    
    const backupId = this.generateBackupId();
    const timestamp = new Date().toISOString();
    
    // Get last backup timestamp
    const lastBackup = await this.getLastBackup();
    const lastBackupTime = lastBackup ? new Date(lastBackup.metadata.timestamp) : new Date(0);
    
    // Fetch only changed data since last backup
    const [articles, tags, series, users] = await Promise.all([
      this.prisma.article.findMany({
        where: { updatedAt: { gt: lastBackupTime } },
        include: { tags: true, series: true, author: true, cover: true },
      }),
      this.prisma.tag.findMany({
        where: { updatedAt: { gt: lastBackupTime } },
      }),
      this.prisma.series.findMany({
        where: { updatedAt: { gt: lastBackupTime } },
      }),
      this.prisma.user.findMany({
        where: { updatedAt: { gt: lastBackupTime } },
      }),
    ]);

    const backupData: BackupData = {
      metadata: {
        id: backupId,
        timestamp,
        type: 'incremental',
        description,
        size: 0,
        checksum: '',
        articleCount: articles.length,
        tagCount: tags.length,
        seriesCount: series.length,
        version: await this.getDatabaseVersion(),
      },
      articles,
      tags,
      series,
      users,
      settings: await this.getSettings(),
      relationships: await this.getRelationships(),
    };

    backupData.metadata.checksum = this.calculateChecksum(backupData);
    const backupPath = await this.saveBackup(backupData);
    
    console.log(`✅ Incremental backup created: ${backupPath}`);
    return backupPath;
  }

  /**
   * Create migration backup
   */
  async createMigrationBackup(description: string = 'Migration backup'): Promise<string> {
    console.log('💾 Creating migration backup...');
    
    const backupId = this.generateBackupId();
    const timestamp = new Date().toISOString();
    
    // Create comprehensive backup before migration
    const backupData = await this.createBackupData(backupId, timestamp, 'migration', description);
    const backupPath = await this.saveBackup(backupData);
    
    console.log(`✅ Migration backup created: ${backupPath}`);
    return backupPath;
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backupId: string): Promise<RollbackResult> {
    console.log(`🔄 Restoring from backup: ${backupId}`);
    
    const result: RollbackResult = {
      success: false,
      restored: { articles: 0, tags: 0, series: 0, users: 0 },
      errors: [],
      warnings: [],
    };

    try {
      // Load backup data
      const backupData = await this.loadBackup(backupId);
      
      if (!backupData) {
        result.errors.push(`Backup ${backupId} not found`);
        return result;
      }

      // Verify backup integrity
      if (!this.verifyBackupIntegrity(backupData)) {
        result.errors.push(`Backup ${backupId} is corrupted`);
        return result;
      }

      // Create current state backup before restore
      const currentBackup = await this.createFullBackup(`Pre-restore backup for ${backupId}`);
      result.warnings.push(`Current state backed up to: ${currentBackup}`);

      // Start transaction
      await this.prisma.$transaction(async (tx) => {
        // Clear existing data (be careful with this in production!)
        await this.clearDatabase(tx);

        // Restore data
        await this.restoreData(backupData, tx);
      });

      // Update restored counts
      result.restored = {
        articles: backupData.articles.length,
        tags: backupData.tags.length,
        series: backupData.series.length,
        users: backupData.users.length,
      };

      result.success = true;
      console.log(`✅ Successfully restored from backup: ${backupId}`);

    } catch (error) {
      result.errors.push(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('❌ Restore failed:', error);
    }

    return result;
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const files = await fs.readdir(this.backupDir);
      const backupFiles = files.filter(file => file.endsWith('.json'));
      
      const backups: BackupMetadata[] = [];
      
      for (const file of backupFiles) {
        try {
          const backupPath = path.join(this.backupDir, file);
          const backupData = await this.loadBackupFromFile(backupPath);
          if (backupData?.metadata) {
            backups.push(backupData.metadata);
          }
        } catch (error) {
          console.warn(`⚠️  Could not read backup file ${file}:`, error);
        }
      }
      
      return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('❌ Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Delete backup
   */
  async deleteBackup(backupId: string): Promise<boolean> {
    try {
      const backupPath = path.join(this.backupDir, `${backupId}.json`);
      await fs.unlink(backupPath);
      console.log(`🗑️  Deleted backup: ${backupId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete backup ${backupId}:`, error);
      return false;
    }
  }

  /**
   * Clean old backups
   */
  private async cleanOldBackups(): Promise<void> {
    const backups = await this.listBackups();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);
    
    const oldBackups = backups.filter(backup => 
      new Date(backup.timestamp) < cutoffDate
    );
    
    // Keep only the most recent backups up to maxBackups
    const recentBackups = backups
      .filter(backup => new Date(backup.timestamp) >= cutoffDate)
      .slice(0, this.config.maxBackups);
    
    const backupsToDelete = [...oldBackups, ...backups.slice(this.config.maxBackups)];
    
    for (const backup of backupsToDelete) {
      await this.deleteBackup(backup.id);
    }
    
    if (backupsToDelete.length > 0) {
      console.log(`🧹 Cleaned ${backupsToDelete.length} old backups`);
    }
  }

  /**
   * Create backup data structure
   */
  private async createBackupData(
    backupId: string, 
    timestamp: string, 
    type: 'full' | 'incremental' | 'migration' | 'sync',
    description: string
  ): Promise<BackupData> {
    const [articles, tags, series, users, settings, relationships] = await Promise.all([
      this.prisma.article.findMany({
        include: { tags: true, series: true, author: true, cover: true },
      }),
      this.prisma.tag.findMany(),
      this.prisma.series.findMany(),
      this.prisma.user.findMany(),
      this.getSettings(),
      this.getRelationships(),
    ]);

    return {
      metadata: {
        id: backupId,
        timestamp,
        type,
        description,
        size: 0,
        checksum: '',
        articleCount: articles.length,
        tagCount: tags.length,
        seriesCount: series.length,
        version: await this.getDatabaseVersion(),
      },
      articles,
      tags,
      series,
      users,
      settings,
      relationships,
    };
  }

  /**
   * Save backup to file
   */
  private async saveBackup(backupData: BackupData): Promise<string> {
    const backupPath = path.join(this.backupDir, `${backupData.metadata.id}.json`);
    
    let data = JSON.stringify(backupData, null, 2);
    
    // Apply compression if enabled
    if (this.config.compressionEnabled) {
      // Implementation for compression would go here
    }
    
    // Apply encryption if enabled
    if (this.config.encryptionEnabled && this.config.encryptionKey) {
      // Implementation for encryption would go here
    }
    
    await fs.writeFile(backupPath, data);
    
    // Update size in metadata
    const stats = await fs.stat(backupPath);
    backupData.metadata.size = stats.size;
    
    return backupPath;
  }

  /**
   * Load backup from file
   */
  private async loadBackup(backupId: string): Promise<BackupData | null> {
    const backupPath = path.join(this.backupDir, `${backupId}.json`);
    return this.loadBackupFromFile(backupPath);
  }

  /**
   * Load backup from file path
   */
  private async loadBackupFromFile(backupPath: string): Promise<BackupData | null> {
    try {
      const data = await fs.readFile(backupPath, 'utf-8');
      
      // Handle decryption if needed
      // Handle decompression if needed
      
      return JSON.parse(data) as BackupData;
    } catch (error) {
      console.error(`❌ Failed to load backup from ${backupPath}:`, error);
      return null;
    }
  }

  /**
   * Restore data to database
   */
  private async restoreData(backupData: BackupData, tx: any): Promise<void> {
    // Restore users first (for foreign key constraints)
    for (const user of backupData.users) {
      await tx.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }

    // Restore tags
    for (const tag of backupData.tags) {
      await tx.tag.upsert({
        where: { id: tag.id },
        update: tag,
        create: tag,
      });
    }

    // Restore series
    for (const series of backupData.series) {
      await tx.series.upsert({
        where: { id: series.id },
        update: series,
        create: series,
      });
    }

    // Restore articles
    for (const article of backupData.articles) {
      await tx.article.upsert({
        where: { id: article.id },
        update: article,
        create: article,
      });
    }

    // Restore relationships
    for (const articleTag of backupData.relationships.articleTags) {
      await tx.articleTag.upsert({
        where: { articleId_tagId: { articleId: articleTag.articleId, tagId: articleTag.tagId } },
        update: articleTag,
        create: articleTag,
      });
    }
  }

  /**
   * Clear database (use with caution!)
   */
  private async clearDatabase(tx: any): Promise<void> {
    // Clear in correct order to respect foreign key constraints
    await tx.articleTag.deleteMany();
    await tx.articleVersion.deleteMany();
    await tx.reaction.deleteMany();
    await tx.article.deleteMany();
    await tx.tag.deleteMany();
    await tx.series.deleteMany();
    await tx.imageAsset.deleteMany();
    // Don't delete users to preserve authentication
  }

  /**
   * Get database version
   */
  private async getDatabaseVersion(): Promise<string> {
    // Implementation to get database schema version
    return '1.0.0';
  }

  /**
   * Get application settings
   */
  private async getSettings(): Promise<any> {
    // Implementation to get application settings
    return {};
  }

  /**
   * Get relationships data
   */
  private async getRelationships(): Promise<any> {
    const [articleTags, articleSeries] = await Promise.all([
      this.prisma.articleTag.findMany(),
      this.prisma.article.findMany({
        where: { seriesId: { not: null } },
        select: { id: true, seriesId: true },
      }),
    ]);

    return {
      articleTags,
      articleSeries,
    };
  }

  /**
   * Get last backup
   */
  private async getLastBackup(): Promise<BackupMetadata | null> {
    const backups = await this.listBackups();
    return backups.length > 0 ? backups[0] : null;
  }

  /**
   * Generate backup ID
   */
  private generateBackupId(): string {
    return `backup_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  /**
   * Calculate checksum
   */
  private calculateChecksum(data: any): string {
    return createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  /**
   * Verify backup integrity
   */
  private verifyBackupIntegrity(backupData: BackupData): boolean {
    const calculatedChecksum = this.calculateChecksum(backupData);
    return calculatedChecksum === backupData.metadata.checksum;
  }
}

// Export for use in other modules
export { BackupSystem, BackupConfig, BackupMetadata, BackupData, RollbackResult };
