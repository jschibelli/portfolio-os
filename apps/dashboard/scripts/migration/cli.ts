#!/usr/bin/env node
/**
 * Migration CLI Tool
 * Command-line interface for content migration operations
 */

import { program } from 'commander';
import { HashnodeMigrationTool } from './hashnode-migration';
import { BackupSystem } from '../../lib/backup/backup-system';
import { MigrationAnalytics } from '../../lib/analytics/migration-analytics';
import { BidirectionalSync } from '../../lib/sync/bidirectional-sync';

// CLI configuration
program
  .name('migration-cli')
  .description('Content Migration & Sync CLI Tool')
  .version('1.0.0');

// Migration command
program
  .command('migrate')
  .description('Migrate content from Hashnode to Dashboard')
  .option('-d, --dry-run', 'Perform a dry run without making changes')
  .option('-b, --batch-size <size>', 'Batch size for processing', '10')
  .option('--no-backup', 'Skip creating backup before migration')
  .option('--no-sync', 'Skip setting up sync after migration')
  .option('--no-analytics', 'Skip analytics tracking')
  .action(async (options) => {
    console.log('🚀 Starting content migration...');
    
    try {
      // Initialize systems
      const backupSystem = new BackupSystem();
      const analytics = new MigrationAnalytics();
      
      await Promise.all([
        backupSystem.initialize(),
        analytics.initialize(),
      ]);

      // Create backup if enabled
      if (options.backup) {
        console.log('💾 Creating migration backup...');
        await backupSystem.createMigrationBackup('CLI Migration Backup');
      }

      // Initialize migration tool
      const migrationTool = new HashnodeMigrationTool({
        batchSize: parseInt(options.batchSize),
        dryRun: options.dryRun,
        backupEnabled: options.backup,
        syncEnabled: options.sync,
        analyticsEnabled: options.analytics,
      });

      // Start analytics tracking
      if (options.analytics) {
        analytics.startRealTimeTracking('migration', 100);
      }

      // Run migration
      const result = await migrationTool.migrate();

      // Generate report
      if (options.analytics) {
        const report = await analytics.generateMigrationReport(
          'migration',
          result.success ? 'success' : 'failed',
          result.errors,
          []
        );
        console.log(`📊 Migration report generated: ${report.id}`);
      }

      // Display results
      console.log('\n📊 Migration Results:');
      console.log(`✅ Successfully imported: ${result.imported}`);
      console.log(`❌ Failed: ${result.failed}`);
      console.log(`⏭️  Skipped: ${result.skipped}`);
      console.log(`⏱️  Duration: ${result.analytics.migrationDuration}ms`);
      console.log(`📈 Success rate: ${result.analytics.successRate.toFixed(2)}%`);

      if (result.errors.length > 0) {
        console.log('\n❌ Errors:');
        result.errors.forEach(error => console.log(`  - ${error}`));
      }

      process.exit(result.success ? 0 : 1);

    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  });

// Backup command
program
  .command('backup')
  .description('Create content backup')
  .option('-t, --type <type>', 'Backup type (full|incremental)', 'full')
  .option('-d, --description <description>', 'Backup description')
  .action(async (options) => {
    console.log('💾 Creating backup...');
    
    try {
      const backupSystem = new BackupSystem();
      await backupSystem.initialize();

      let backupPath: string;
      if (options.type === 'full') {
        backupPath = await backupSystem.createFullBackup(options.description);
      } else {
        backupPath = await backupSystem.createIncrementalBackup(options.description);
      }

      console.log(`✅ Backup created: ${backupPath}`);

    } catch (error) {
      console.error('❌ Backup failed:', error);
      process.exit(1);
    }
  });

// Restore command
program
  .command('restore')
  .description('Restore from backup')
  .requiredOption('-i, --id <backupId>', 'Backup ID to restore from')
  .action(async (options) => {
    console.log(`🔄 Restoring from backup: ${options.id}`);
    
    try {
      const backupSystem = new BackupSystem();
      await backupSystem.initialize();

      const result = await backupSystem.restoreFromBackup(options.id);

      if (result.success) {
        console.log('✅ Restore completed successfully');
        console.log(`📊 Restored: ${result.restored.articles} articles, ${result.restored.tags} tags, ${result.restored.series} series`);
      } else {
        console.log('❌ Restore failed');
        result.errors.forEach(error => console.log(`  - ${error}`));
      }

    } catch (error) {
      console.error('❌ Restore failed:', error);
      process.exit(1);
    }
  });

// List backups command
program
  .command('list-backups')
  .description('List available backups')
  .action(async () => {
    try {
      const backupSystem = new BackupSystem();
      await backupSystem.initialize();

      const backups = await backupSystem.listBackups();

      if (backups.length === 0) {
        console.log('📋 No backups found');
        return;
      }

      console.log('📋 Available backups:');
      backups.forEach(backup => {
        console.log(`  ${backup.id} - ${backup.type} (${backup.timestamp})`);
        console.log(`    Description: ${backup.description}`);
        console.log(`    Articles: ${backup.articleCount}, Tags: ${backup.tagCount}, Series: ${backup.seriesCount}`);
        console.log('');
      });

    } catch (error) {
      console.error('❌ Failed to list backups:', error);
      process.exit(1);
    }
  });

// Sync command
program
  .command('sync')
  .description('Start bidirectional sync system')
  .option('-p, --port <port>', 'Webhook port', '3000')
  .action(async (options) => {
    console.log('🔄 Starting bidirectional sync system...');
    
    try {
      const syncSystem = new BidirectionalSync();
      await syncSystem.initialize();

      console.log('✅ Sync system started');
      console.log(`📡 Webhook endpoint: http://localhost:${options.port}/api/webhooks/hashnode`);
      console.log('Press Ctrl+C to stop');

      // Keep the process running
      process.on('SIGINT', async () => {
        console.log('\n🛑 Stopping sync system...');
        await syncSystem.stop();
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ Sync system failed to start:', error);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Check system status')
  .action(async () => {
    try {
      const backupSystem = new BackupSystem();
      const analytics = new MigrationAnalytics();
      
      await Promise.all([
        backupSystem.initialize(),
        analytics.initialize(),
      ]);

      const backups = await backupSystem.listBackups();
      const realTimeMetrics = analytics.getRealTimeMetrics();
      const metricsHistory = analytics.getMetricsHistory();

      console.log('📊 System Status:');
      console.log(`  Backup System: ✅ Enabled (${backups.length} backups)`);
      console.log(`  Analytics: ✅ Enabled (${metricsHistory.length} metrics)`);
      console.log(`  Real-time Tracking: ${realTimeMetrics ? '🔄 Active' : '⏸️  Inactive'}`);
      
      if (backups.length > 0) {
        console.log(`  Last Backup: ${backups[0].timestamp}`);
      }

    } catch (error) {
      console.error('❌ Status check failed:', error);
      process.exit(1);
    }
  });

// Analytics command
program
  .command('analytics')
  .description('View migration analytics')
  .option('-f, --format <format>', 'Output format (json|table)', 'table')
  .action(async (options) => {
    try {
      const analytics = new MigrationAnalytics();
      await analytics.initialize();

      const metricsHistory = analytics.getMetricsHistory();
      const realTimeMetrics = analytics.getRealTimeMetrics();

      if (options.format === 'json') {
        console.log(JSON.stringify({
          realTimeMetrics,
          metricsHistory,
        }, null, 2));
      } else {
        console.log('📊 Migration Analytics:');
        
        if (realTimeMetrics) {
          console.log(`  Current Operation: ${realTimeMetrics.currentOperation}`);
          console.log(`  Progress: ${realTimeMetrics.progress.toFixed(1)}%`);
          console.log(`  Processed: ${realTimeMetrics.processed}/${realTimeMetrics.total}`);
          console.log(`  Errors: ${realTimeMetrics.errors}`);
          console.log(`  Warnings: ${realTimeMetrics.warnings}`);
        }

        if (metricsHistory.length > 0) {
          const latest = metricsHistory[metricsHistory.length - 1];
          console.log(`  Total Articles: ${latest.totalArticles}`);
          console.log(`  Total Tags: ${latest.totalTags}`);
          console.log(`  Total Series: ${latest.totalSeries}`);
          console.log(`  Success Rate: ${latest.successRate.toFixed(2)}%`);
        }
      }

    } catch (error) {
      console.error('❌ Analytics failed:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// Handle unknown commands
program.on('command:*', () => {
  console.error('❌ Unknown command. Use --help for available commands.');
  process.exit(1);
});

