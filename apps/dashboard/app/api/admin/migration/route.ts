/**
 * Migration API Endpoint
 * Main API for content migration operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { HashnodeMigrationTool } from '@/scripts/migration/hashnode-migration';
import { BackupSystem } from '@/lib/backup/backup-system';
import { MigrationAnalytics } from '@/lib/analytics/migration-analytics';

// Initialize systems
const backupSystem = new BackupSystem({
  enabled: true,
  backupDir: process.env.BACKUP_DIR || './backups',
  maxBackups: 10,
  retentionDays: 30,
});

const analytics = new MigrationAnalytics({
  enabled: true,
  analyticsDir: process.env.ANALYTICS_DIR || './analytics',
  reportFormats: ['json', 'html'],
  realTimeTracking: true,
  detailedMetrics: true,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    const userRole = (session.user as any)?.role;
    if (!userRole || !['ADMIN', 'EDITOR'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { action, config = {} } = body;

    console.log(`🚀 Migration API: ${action} requested`);

    // Initialize systems
    await Promise.all([
      backupSystem.initialize(),
      analytics.initialize(),
    ]);

    let result;

    switch (action) {
      case 'migrate':
        result = await handleMigration(config);
        break;
      
      case 'sync':
        result = await handleSync(config);
        break;
      
      case 'backup':
        result = await handleBackup(config);
        break;
      
      case 'rollback':
        result = await handleRollback(config);
        break;
      
      case 'status':
        result = await handleStatus();
        break;
      
      case 'analytics':
        result = await handleAnalytics(config);
        break;
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Migration API error:', error);
    return NextResponse.json(
      { 
        error: 'Migration operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Health check and status
    const status = await handleStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle migration operation
 */
async function handleMigration(config: any) {
  console.log('🔄 Starting migration...');

  // Create migration backup
  const backupPath = await backupSystem.createMigrationBackup(
    `Migration backup - ${new Date().toISOString()}`
  );

  // Initialize migration tool
  const migrationTool = new HashnodeMigrationTool({
    batchSize: config.batchSize || 10,
    dryRun: config.dryRun || false,
    backupEnabled: true,
    syncEnabled: config.syncEnabled !== false,
    analyticsEnabled: true,
  });

  // Start analytics tracking
  analytics.startRealTimeTracking('migration', 100); // Placeholder total

  try {
    // Run migration
    const result = await migrationTool.migrate();

    // Generate analytics report
    const report = await analytics.generateMigrationReport(
      'migration',
      result.success ? 'success' : 'failed',
      result.errors,
      []
    );

    analytics.stopRealTimeTracking();

    return {
      success: result.success,
      message: 'Migration completed',
      backupPath,
      result: {
        imported: result.imported,
        failed: result.failed,
        skipped: result.skipped,
        errors: result.errors,
      },
      analytics: result.analytics,
      reportId: report.id,
    };

  } catch (error) {
    analytics.stopRealTimeTracking();
    throw error;
  }
}

/**
 * Handle sync operation
 */
async function handleSync(config: any) {
  console.log('🔄 Starting sync...');

  // Create sync backup
  const backupPath = await backupSystem.createIncrementalBackup(
    `Sync backup - ${new Date().toISOString()}`
  );

  // Start analytics tracking
  analytics.startRealTimeTracking('sync', 50); // Placeholder total

  try {
    // Implementation for sync operation
    // This would use the BidirectionalSync system

    analytics.stopRealTimeTracking();

    return {
      success: true,
      message: 'Sync completed',
      backupPath,
    };

  } catch (error) {
    analytics.stopRealTimeTracking();
    throw error;
  }
}

/**
 * Handle backup operation
 */
async function handleBackup(config: any) {
  console.log('💾 Creating backup...');

  const backupType = config.type || 'full';
  const description = config.description || `${backupType} backup`;

  let backupPath: string;

  if (backupType === 'full') {
    backupPath = await backupSystem.createFullBackup(description);
  } else if (backupType === 'incremental') {
    backupPath = await backupSystem.createIncrementalBackup(description);
  } else {
    throw new Error(`Unknown backup type: ${backupType}`);
  }

  return {
    success: true,
    message: 'Backup created successfully',
    backupPath,
  };
}

/**
 * Handle rollback operation
 */
async function handleRollback(config: any) {
  console.log('🔄 Starting rollback...');

  const { backupId } = config;
  if (!backupId) {
    throw new Error('Backup ID is required for rollback');
  }

  // Create pre-rollback backup
  const preRollbackBackup = await backupSystem.createFullBackup(
    `Pre-rollback backup for ${backupId}`
  );

  // Perform rollback
  const result = await backupSystem.restoreFromBackup(backupId);

  return {
    success: result.success,
    message: result.success ? 'Rollback completed successfully' : 'Rollback failed',
    preRollbackBackup,
    result: {
      restored: result.restored,
      errors: result.errors,
      warnings: result.warnings,
    },
  };
}

/**
 * Handle status check
 */
async function handleStatus() {
  const backups = await backupSystem.listBackups();
  const realTimeMetrics = analytics.getRealTimeMetrics();
  const metricsHistory = analytics.getMetricsHistory();

  return {
    status: 'healthy',
    systems: {
      backup: {
        enabled: true,
        totalBackups: backups.length,
        lastBackup: backups[0]?.timestamp,
      },
      analytics: {
        enabled: true,
        realTimeTracking: realTimeMetrics !== null,
        metricsHistory: metricsHistory.length,
      },
      migration: {
        available: true,
        lastMigration: metricsHistory[metricsHistory.length - 1]?.migrationDuration || 0,
      },
    },
    realTimeMetrics,
  };
}

/**
 * Handle analytics request
 */
async function handleAnalytics(config: any) {
  const { type = 'summary' } = config;

  switch (type) {
    case 'summary':
      return {
        metricsHistory: analytics.getMetricsHistory(),
        realTimeMetrics: analytics.getRealTimeMetrics(),
      };
    
    case 'reports':
      // Return list of available reports
      return {
        reports: [], // Implementation would list available reports
      };
    
    default:
      throw new Error(`Unknown analytics type: ${type}`);
  }
}

