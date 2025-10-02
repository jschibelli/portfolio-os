/**
 * Migration Analytics System
 * Comprehensive analytics and reporting for content migration
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

interface AnalyticsConfig {
  enabled: boolean;
  analyticsDir: string;
  reportFormats: ('json' | 'csv' | 'html')[];
  realTimeTracking: boolean;
  detailedMetrics: boolean;
}

interface MigrationMetrics {
  totalArticles: number;
  totalTags: number;
  totalSeries: number;
  totalUsers: number;
  migrationDuration: number;
  successRate: number;
  errorRate: number;
  averageContentLength: number;
  contentTypes: Record<string, number>;
  tagDistribution: Record<string, number>;
  seriesDistribution: Record<string, number>;
  authorDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  visibilityDistribution: Record<string, number>;
  seoMetrics: {
    articlesWithMetaTitle: number;
    articlesWithMetaDescription: number;
    articlesWithOgImage: number;
    averageSeoScore: number;
  };
  performanceMetrics: {
    averageProcessingTime: number;
    peakMemoryUsage: number;
    databaseQueries: number;
    apiCalls: number;
  };
  qualityMetrics: {
    articlesWithImages: number;
    articlesWithTags: number;
    articlesWithSeries: number;
    averageReadingTime: number;
    contentCompleteness: number;
  };
}

interface MigrationReport {
  id: string;
  timestamp: string;
  type: 'migration' | 'sync' | 'backup' | 'rollback';
  status: 'success' | 'failed' | 'partial';
  metrics: MigrationMetrics;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  duration: number;
  dataProcessed: {
    articles: number;
    tags: number;
    series: number;
    users: number;
  };
}

interface RealTimeMetrics {
  currentOperation: string;
  progress: number;
  processed: number;
  total: number;
  errors: number;
  warnings: number;
  startTime: Date;
  estimatedCompletion: Date;
  currentBatch: number;
  totalBatches: number;
}

export class MigrationAnalytics {
  private prisma: PrismaClient;
  private config: AnalyticsConfig;
  private analyticsDir: string;
  private realTimeMetrics: RealTimeMetrics | null = null;
  private metricsHistory: MigrationMetrics[] = [];

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.prisma = new PrismaClient();
    this.config = {
      enabled: true,
      analyticsDir: path.join(process.cwd(), 'analytics'),
      reportFormats: ['json', 'html'],
      realTimeTracking: true,
      detailedMetrics: true,
      ...config,
    };
    this.analyticsDir = this.config.analyticsDir;
  }

  /**
   * Initialize analytics system
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('📊 Analytics system disabled');
      return;
    }

    console.log('📊 Initializing migration analytics...');
    
    // Create analytics directory
    await fs.mkdir(this.analyticsDir, { recursive: true });
    
    console.log('✅ Analytics system initialized');
  }

  /**
   * Start real-time tracking
   */
  startRealTimeTracking(operation: string, total: number): void {
    if (!this.config.realTimeTracking) return;

    this.realTimeMetrics = {
      currentOperation: operation,
      progress: 0,
      processed: 0,
      total,
      errors: 0,
      warnings: 0,
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + 60000), // Placeholder
      currentBatch: 0,
      totalBatches: Math.ceil(total / 10), // Assuming batch size of 10
    };

    console.log(`📊 Started real-time tracking for: ${operation}`);
  }

  /**
   * Update real-time metrics
   */
  updateRealTimeMetrics(updates: Partial<RealTimeMetrics>): void {
    if (!this.realTimeMetrics) return;

    Object.assign(this.realTimeMetrics, updates);
    
    // Calculate progress
    this.realTimeMetrics.progress = (this.realTimeMetrics.processed / this.realTimeMetrics.total) * 100;
    
    // Estimate completion time
    const elapsed = Date.now() - this.realTimeMetrics.startTime.getTime();
    const rate = this.realTimeMetrics.processed / elapsed;
    const remaining = this.realTimeMetrics.total - this.realTimeMetrics.processed;
    this.realTimeMetrics.estimatedCompletion = new Date(Date.now() + (remaining / rate));

    console.log(`📊 Progress: ${this.realTimeMetrics.progress.toFixed(1)}% (${this.realTimeMetrics.processed}/${this.realTimeMetrics.total})`);
  }

  /**
   * Stop real-time tracking
   */
  stopRealTimeTracking(): void {
    if (this.realTimeMetrics) {
      console.log(`📊 Real-time tracking completed for: ${this.realTimeMetrics.currentOperation}`);
      this.realTimeMetrics = null;
    }
  }

  /**
   * Generate comprehensive migration report
   */
  async generateMigrationReport(
    type: 'migration' | 'sync' | 'backup' | 'rollback',
    status: 'success' | 'failed' | 'partial',
    errors: string[] = [],
    warnings: string[] = []
  ): Promise<MigrationReport> {
    console.log(`📊 Generating ${type} report...`);

    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    // Collect comprehensive metrics
    const metrics = await this.collectMetrics();
    this.metricsHistory.push(metrics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(metrics, errors, warnings);

    const report: MigrationReport = {
      id: reportId,
      timestamp,
      type,
      status,
      metrics,
      errors,
      warnings,
      recommendations,
      duration: this.realTimeMetrics ? Date.now() - this.realTimeMetrics.startTime.getTime() : 0,
      dataProcessed: {
        articles: metrics.totalArticles,
        tags: metrics.totalTags,
        series: metrics.totalSeries,
        users: metrics.totalUsers,
      },
    };

    // Save report
    await this.saveReport(report);

    console.log(`✅ Migration report generated: ${reportId}`);
    return report;
  }

  /**
   * Collect comprehensive metrics
   */
  private async collectMetrics(): Promise<MigrationMetrics> {
    const [
      articles,
      tags,
      series,
      users,
      articleStats,
      seoStats,
      performanceStats,
    ] = await Promise.all([
      this.prisma.article.findMany({
        include: { tags: true, series: true, author: true },
      }),
      this.prisma.tag.findMany(),
      this.prisma.series.findMany(),
      this.prisma.user.findMany(),
      this.getArticleStatistics(),
      this.getSeoStatistics(),
      this.getPerformanceStatistics(),
    ]);

    // Calculate distributions
    const contentTypes = this.calculateContentTypes(articles);
    const tagDistribution = this.calculateTagDistribution(articles);
    const seriesDistribution = this.calculateSeriesDistribution(articles);
    const authorDistribution = this.calculateAuthorDistribution(articles);
    const statusDistribution = this.calculateStatusDistribution(articles);
    const visibilityDistribution = this.calculateVisibilityDistribution(articles);

    // Calculate averages
    const averageContentLength = this.calculateAverageContentLength(articles);
    const averageSeoScore = this.calculateAverageSeoScore(articles);
    const averageReadingTime = this.calculateAverageReadingTime(articles);

    // Calculate quality metrics
    const articlesWithImages = articles.filter(a => a.coverId).length;
    const articlesWithTags = articles.filter(a => a.tags.length > 0).length;
    const articlesWithSeries = articles.filter(a => a.seriesId).length;
    const contentCompleteness = this.calculateContentCompleteness(articles);

    return {
      totalArticles: articles.length,
      totalTags: tags.length,
      totalSeries: series.length,
      totalUsers: users.length,
      migrationDuration: 0, // Will be set by caller
      successRate: 0, // Will be set by caller
      errorRate: 0, // Will be set by caller
      averageContentLength,
      contentTypes,
      tagDistribution,
      seriesDistribution,
      authorDistribution,
      statusDistribution,
      visibilityDistribution,
      seoMetrics: {
        articlesWithMetaTitle: seoStats.articlesWithMetaTitle,
        articlesWithMetaDescription: seoStats.articlesWithMetaDescription,
        articlesWithOgImage: seoStats.articlesWithOgImage,
        averageSeoScore,
      },
      performanceMetrics: {
        averageProcessingTime: performanceStats.averageProcessingTime,
        peakMemoryUsage: performanceStats.peakMemoryUsage,
        databaseQueries: performanceStats.databaseQueries,
        apiCalls: performanceStats.apiCalls,
      },
      qualityMetrics: {
        articlesWithImages,
        articlesWithTags,
        articlesWithSeries,
        averageReadingTime,
        contentCompleteness,
      },
    };
  }

  /**
   * Generate recommendations based on metrics
   */
  private generateRecommendations(
    metrics: MigrationMetrics,
    errors: string[],
    warnings: string[]
  ): string[] {
    const recommendations: string[] = [];

    // SEO recommendations
    if (metrics.seoMetrics.articlesWithMetaTitle < metrics.totalArticles * 0.8) {
      recommendations.push('Consider adding meta titles to improve SEO for articles without them');
    }

    if (metrics.seoMetrics.articlesWithMetaDescription < metrics.totalArticles * 0.8) {
      recommendations.push('Consider adding meta descriptions to improve SEO for articles without them');
    }

    // Content quality recommendations
    if (metrics.qualityMetrics.articlesWithImages < metrics.totalArticles * 0.5) {
      recommendations.push('Consider adding cover images to articles to improve visual appeal');
    }

    if (metrics.qualityMetrics.articlesWithTags < metrics.totalArticles * 0.7) {
      recommendations.push('Consider adding tags to articles to improve categorization and discoverability');
    }

    // Performance recommendations
    if (metrics.performanceMetrics.averageProcessingTime > 5000) {
      recommendations.push('Consider optimizing processing time by implementing batch processing or parallel operations');
    }

    // Error-based recommendations
    if (errors.length > 0) {
      recommendations.push('Review and fix migration errors to improve success rate');
    }

    if (warnings.length > 0) {
      recommendations.push('Address migration warnings to improve data quality');
    }

    return recommendations;
  }

  /**
   * Save report in multiple formats
   */
  private async saveReport(report: MigrationReport): Promise<void> {
    const reportDir = path.join(this.analyticsDir, 'reports');
    await fs.mkdir(reportDir, { recursive: true });

    const basePath = path.join(reportDir, report.id);

    // Save JSON report
    if (this.config.reportFormats.includes('json')) {
      await fs.writeFile(
        `${basePath}.json`,
        JSON.stringify(report, null, 2)
      );
    }

    // Save HTML report
    if (this.config.reportFormats.includes('html')) {
      const htmlReport = this.generateHtmlReport(report);
      await fs.writeFile(`${basePath}.html`, htmlReport);
    }

    // Save CSV report
    if (this.config.reportFormats.includes('csv')) {
      const csvReport = this.generateCsvReport(report);
      await fs.writeFile(`${basePath}.csv`, csvReport);
    }
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(report: MigrationReport): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Migration Report - ${report.id}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #333; }
        .metric-label { color: #666; font-size: 14px; }
        .recommendations { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .error { color: #d32f2f; }
        .warning { color: #f57c00; }
        .success { color: #388e3c; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Migration Report</h1>
        <p><strong>Report ID:</strong> ${report.id}</p>
        <p><strong>Type:</strong> ${report.type}</p>
        <p><strong>Status:</strong> <span class="${report.status}">${report.status}</span></p>
        <p><strong>Timestamp:</strong> ${report.timestamp}</p>
        <p><strong>Duration:</strong> ${report.duration}ms</p>
    </div>

    <div class="metrics">
        <div class="metric-card">
            <div class="metric-value">${report.metrics.totalArticles}</div>
            <div class="metric-label">Total Articles</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${report.metrics.totalTags}</div>
            <div class="metric-label">Total Tags</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${report.metrics.totalSeries}</div>
            <div class="metric-label">Total Series</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">${report.metrics.successRate.toFixed(1)}%</div>
            <div class="metric-label">Success Rate</div>
        </div>
    </div>

    ${report.recommendations.length > 0 ? `
    <div class="recommendations">
        <h3>Recommendations</h3>
        <ul>
            ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${report.errors.length > 0 ? `
    <div class="error">
        <h3>Errors</h3>
        <ul>
            ${report.errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${report.warnings.length > 0 ? `
    <div class="warning">
        <h3>Warnings</h3>
        <ul>
            ${report.warnings.map(warning => `<li>${warning}</li>`).join('')}
        </ul>
    </div>
    ` : ''}
</body>
</html>
    `;
  }

  /**
   * Generate CSV report
   */
  private generateCsvReport(report: MigrationReport): string {
    const rows = [
      ['Metric', 'Value'],
      ['Report ID', report.id],
      ['Type', report.type],
      ['Status', report.status],
      ['Timestamp', report.timestamp],
      ['Duration (ms)', report.duration.toString()],
      ['Total Articles', report.metrics.totalArticles.toString()],
      ['Total Tags', report.metrics.totalTags.toString()],
      ['Total Series', report.metrics.totalSeries.toString()],
      ['Success Rate', report.metrics.successRate.toString()],
      ['Error Rate', report.metrics.errorRate.toString()],
      ['Average Content Length', report.metrics.averageContentLength.toString()],
    ];

    return rows.map(row => row.join(',')).join('\n');
  }

  /**
   * Get current real-time metrics
   */
  getRealTimeMetrics(): RealTimeMetrics | null {
    return this.realTimeMetrics;
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(): MigrationMetrics[] {
    return [...this.metricsHistory];
  }

  /**
   * Helper methods for calculating metrics
   */
  private async getArticleStatistics(): Promise<any> {
    // Implementation for article statistics
    return {};
  }

  private async getSeoStatistics(): Promise<any> {
    const articles = await this.prisma.article.findMany({
      select: { metaTitle: true, metaDescription: true, ogImageUrl: true },
    });

    return {
      articlesWithMetaTitle: articles.filter(a => a.metaTitle).length,
      articlesWithMetaDescription: articles.filter(a => a.metaDescription).length,
      articlesWithOgImage: articles.filter(a => a.ogImageUrl).length,
    };
  }

  private async getPerformanceStatistics(): Promise<any> {
    // Implementation for performance statistics
    return {
      averageProcessingTime: 0,
      peakMemoryUsage: 0,
      databaseQueries: 0,
      apiCalls: 0,
    };
  }

  private calculateContentTypes(articles: any[]): Record<string, number> {
    // Implementation for content type distribution
    return {};
  }

  private calculateTagDistribution(articles: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    articles.forEach(article => {
      article.tags.forEach((tag: any) => {
        distribution[tag.name] = (distribution[tag.name] || 0) + 1;
      });
    });
    return distribution;
  }

  private calculateSeriesDistribution(articles: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    articles.forEach(article => {
      if (article.series) {
        distribution[article.series.title] = (distribution[article.series.title] || 0) + 1;
      }
    });
    return distribution;
  }

  private calculateAuthorDistribution(articles: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    articles.forEach(article => {
      const authorName = article.author?.name || 'Unknown';
      distribution[authorName] = (distribution[authorName] || 0) + 1;
    });
    return distribution;
  }

  private calculateStatusDistribution(articles: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    articles.forEach(article => {
      distribution[article.status] = (distribution[article.status] || 0) + 1;
    });
    return distribution;
  }

  private calculateVisibilityDistribution(articles: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    articles.forEach(article => {
      distribution[article.visibility] = (distribution[article.visibility] || 0) + 1;
    });
    return distribution;
  }

  private calculateAverageContentLength(articles: any[]): number {
    if (articles.length === 0) return 0;
    const totalLength = articles.reduce((sum, article) => {
      const contentLength = article.contentMdx?.length || 0;
      return sum + contentLength;
    }, 0);
    return totalLength / articles.length;
  }

  private calculateAverageSeoScore(articles: any[]): number {
    if (articles.length === 0) return 0;
    const totalScore = articles.reduce((sum, article) => {
      return sum + (article.seoScore || 0);
    }, 0);
    return totalScore / articles.length;
  }

  private calculateAverageReadingTime(articles: any[]): number {
    if (articles.length === 0) return 0;
    const totalTime = articles.reduce((sum, article) => {
      return sum + (article.readingMinutes || 0);
    }, 0);
    return totalTime / articles.length;
  }

  private calculateContentCompleteness(articles: any[]): number {
    if (articles.length === 0) return 0;
    
    let totalCompleteness = 0;
    articles.forEach(article => {
      let completeness = 0;
      if (article.title) completeness += 20;
      if (article.contentMdx) completeness += 30;
      if (article.excerpt) completeness += 15;
      if (article.tags.length > 0) completeness += 15;
      if (article.coverId) completeness += 10;
      if (article.metaTitle) completeness += 5;
      if (article.metaDescription) completeness += 5;
      
      totalCompleteness += completeness;
    });
    
    return totalCompleteness / articles.length;
  }
}

// Export for use in other modules
export { MigrationAnalytics, AnalyticsConfig, MigrationMetrics, MigrationReport, RealTimeMetrics };

