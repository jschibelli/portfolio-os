#!/usr/bin/env node

/**
 * Social Media Master Testing Suite
 * 
 * Comprehensive testing suite that combines all social media validation tools
 * with automated testing, reporting, and optimization recommendations.
 * 
 * Usage:
 *   node scripts/social-media-master-test.js
 *   node scripts/social-media-master-test.js --url https://your-site.com
 *   node scripts/social-media-master-test.js --full-suite
 *   node scripts/social-media-master-test.js --generate-report --optimize
 */

const fs = require('fs').promises;
const path = require('path');
const { SocialMediaTester } = require('./social-media-testing.js');
const { SocialMediaLinksGenerator } = require('./social-media-links-generator.js');
const { OpenGraphValidator } = require('./og-validator.js');

// Configuration
const DEFAULT_BASE_URL = 'https://johnschibelli.dev';
const TEST_PAGES = [
  '/',
  '/projects',
  '/case-studies',
  '/blog',
  '/about',
  '/contact'
];

class SocialMediaMasterTester {
  constructor(baseUrl = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl;
    this.results = {
      timestamp: new Date().toISOString(),
      baseUrl,
      tests: {},
      summary: {},
      recommendations: []
    };
  }

  /**
   * Run comprehensive social media testing suite
   */
  async runFullSuite() {
    console.log(`🚀 Social Media Master Testing Suite`);
    console.log(`Base URL: ${this.baseUrl}`);
    console.log(`Testing ${TEST_PAGES.length} pages...`);
    console.log(`${'='.repeat(60)}`);

    // 1. Basic metadata validation
    console.log(`\n📋 Step 1: Basic Metadata Validation`);
    const basicTester = new SocialMediaTester(this.baseUrl);
    const basicResults = [];
    
    for (const pagePath of TEST_PAGES) {
      const result = await basicTester.testPage(pagePath);
      basicResults.push(result);
    }
    
    this.results.tests.basicValidation = {
      tester: 'SocialMediaTester',
      results: basicResults,
      summary: this.analyzeBasicResults(basicResults)
    };

    // 2. Open Graph validation
    console.log(`\n🔍 Step 2: Open Graph Validation`);
    const ogValidator = new OpenGraphValidator(this.baseUrl);
    const ogResults = [];
    
    for (const pagePath of TEST_PAGES) {
      const result = await ogValidator.validatePage(`${this.baseUrl}${pagePath}`);
      ogResults.push(result);
    }
    
    this.results.tests.openGraphValidation = {
      tester: 'OpenGraphValidator',
      results: ogResults,
      summary: this.analyzeOGResults(ogResults)
    };

    // 3. Generate testing links
    console.log(`\n🔗 Step 3: External Testing Links`);
    const linksGenerator = new SocialMediaLinksGenerator(this.baseUrl);
    this.results.tests.externalLinks = {
      tester: 'SocialMediaLinksGenerator',
      generatedUrls: linksGenerator.generateTestingUrls(`${this.baseUrl}/`),
      allPages: TEST_PAGES.map(page => ({
        path: page,
        testingUrls: linksGenerator.generateTestingUrls(`${this.baseUrl}${page}`)
      }))
    };

    // 4. Performance analysis
    console.log(`\n⚡ Step 4: Performance Analysis`);
    const performanceResults = await this.analyzePerformance();
    this.results.tests.performance = performanceResults;

    // 5. Generate recommendations
    console.log(`\n💡 Step 5: Optimization Recommendations`);
    const recommendations = this.generateRecommendations();
    this.results.recommendations = recommendations;

    // 6. Generate summary
    this.results.summary = this.generateSummary();

    this.printMasterReport();
    return this.results;
  }

  /**
   * Analyze basic validation results
   */
  analyzeBasicResults(results) {
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    
    const errors = results.reduce((sum, r) => {
      if (r.openGraph) sum += r.openGraph.errors.length;
      if (r.twitterCards) sum += r.twitterCards.errors.length;
      return sum;
    }, 0);
    
    const warnings = results.reduce((sum, r) => {
      if (r.openGraph) sum += r.openGraph.warnings.length;
      if (r.twitterCards) sum += r.twitterCards.warnings.length;
      return sum;
    }, 0);

    return {
      totalPages: total,
      successfulPages: successful,
      failedPages: total - successful,
      totalErrors: errors,
      totalWarnings: warnings,
      successRate: Math.round((successful / total) * 100)
    };
  }

  /**
   * Analyze Open Graph validation results
   */
  analyzeOGResults(results) {
    const validResults = results.filter(r => !r.error);
    
    if (validResults.length === 0) {
      return {
        averageOGScore: 0,
        averageTwitterScore: 0,
        totalErrors: 0,
        totalWarnings: 0,
        pagesAnalyzed: 0
      };
    }

    const avgOGScore = Math.round(
      validResults.reduce((sum, r) => sum + (r.openGraph.score / r.openGraph.maxScore), 0) / validResults.length * 100
    );
    
    const avgTwitterScore = Math.round(
      validResults.reduce((sum, r) => sum + (r.twitter.score / r.twitter.maxScore), 0) / validResults.length * 100
    );

    const totalErrors = validResults.reduce((sum, r) => 
      sum + r.openGraph.errors.length + r.twitter.errors.length, 0);
    
    const totalWarnings = validResults.reduce((sum, r) => 
      sum + r.openGraph.warnings.length + r.twitter.warnings.length, 0);

    return {
      averageOGScore: avgOGScore,
      averageTwitterScore: avgTwitterScore,
      totalErrors,
      totalWarnings,
      pagesAnalyzed: validResults.length,
      scoreBreakdown: validResults.map(r => ({
        url: r.url,
        ogScore: Math.round((r.openGraph.score / r.openGraph.maxScore) * 100),
        twitterScore: Math.round((r.twitter.score / r.twitter.maxScore) * 100)
      }))
    };
  }

  /**
   * Analyze performance metrics
   */
  async analyzePerformance() {
    const performanceResults = [];
    
    for (const pagePath of TEST_PAGES) {
      const startTime = Date.now();
      
      try {
        const https = require('https');
        const { URL } = require('url');
        
        const url = `${this.baseUrl}${pagePath}`;
        const response = await new Promise((resolve, reject) => {
          const request = https.get(url, resolve);
          request.on('error', reject);
          request.setTimeout(5000, () => {
            request.destroy();
            reject(new Error('Timeout'));
          });
        });
        
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        
        performanceResults.push({
          path: pagePath,
          url,
          loadTime,
          statusCode: response.statusCode,
          success: response.statusCode === 200
        });
        
      } catch (error) {
        performanceResults.push({
          path: pagePath,
          url: `${this.baseUrl}${pagePath}`,
          loadTime: null,
          error: error.message,
          success: false
        });
      }
    }
    
    const avgLoadTime = performanceResults
      .filter(r => r.loadTime)
      .reduce((sum, r) => sum + r.loadTime, 0) / performanceResults.filter(r => r.loadTime).length;
    
    return {
      pages: performanceResults,
      averageLoadTime: Math.round(avgLoadTime),
      successfulLoads: performanceResults.filter(r => r.success).length,
      totalPages: performanceResults.length
    };
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    // Analyze results and generate recommendations
    if (this.results.tests.basicValidation) {
      const basicSummary = this.results.tests.basicValidation.summary;
      
      if (basicSummary.totalErrors > 0) {
        recommendations.push({
          priority: 'high',
          category: 'metadata',
          title: 'Fix Critical Metadata Errors',
          description: `${basicSummary.totalErrors} critical errors found in metadata. These should be fixed immediately.`,
          action: 'Review and fix all metadata errors before deploying.'
        });
      }
      
      if (basicSummary.totalWarnings > 0) {
        recommendations.push({
          priority: 'medium',
          category: 'metadata',
          title: 'Address Metadata Warnings',
          description: `${basicSummary.totalWarnings} warnings found in metadata. These should be addressed for optimal social sharing.`,
          action: 'Review warnings and implement recommended improvements.'
        });
      }
    }
    
    if (this.results.tests.openGraphValidation) {
      const ogSummary = this.results.tests.openGraphValidation.summary;
      
      if (ogSummary.averageOGScore < 80) {
        recommendations.push({
          priority: 'medium',
          category: 'open-graph',
          title: 'Improve Open Graph Scores',
          description: `Average OG score is ${ogSummary.averageOGScore}%. Aim for 90%+ for optimal social sharing.`,
          action: 'Optimize OG tags, especially image dimensions and descriptions.'
        });
      }
      
      if (ogSummary.averageTwitterScore < 80) {
        recommendations.push({
          priority: 'medium',
          category: 'twitter',
          title: 'Improve Twitter Card Scores',
          description: `Average Twitter score is ${ogSummary.averageTwitterScore}%. Optimize for better Twitter sharing.`,
          action: 'Add missing Twitter-specific tags and optimize existing ones.'
        });
      }
    }
    
    if (this.results.tests.performance) {
      const perfSummary = this.results.tests.performance;
      
      if (perfSummary.averageLoadTime > 3000) {
        recommendations.push({
          priority: 'high',
          category: 'performance',
          title: 'Optimize Page Load Times',
          description: `Average load time is ${perfSummary.averageLoadTime}ms. Social platforms prefer faster loading pages.`,
          action: 'Optimize images, reduce bundle size, and improve server response times.'
        });
      }
    }
    
    // General recommendations
    recommendations.push({
      priority: 'low',
      category: 'monitoring',
      title: 'Set Up Regular Testing',
      description: 'Implement automated testing to catch metadata issues early.',
      action: 'Run this test suite regularly and integrate into CI/CD pipeline.'
    });
    
    recommendations.push({
      priority: 'low',
      category: 'optimization',
      title: 'Monitor Social Sharing Performance',
      description: 'Track how your content performs across social platforms.',
      action: 'Use analytics tools to monitor click-through rates and engagement.'
    });
    
    return recommendations;
  }

  /**
   * Generate overall summary
   */
  generateSummary() {
    const summary = {
      overallScore: 0,
      status: 'unknown',
      keyMetrics: {},
      nextSteps: []
    };
    
    if (this.results.tests.basicValidation) {
      const basic = this.results.tests.basicValidation.summary;
      summary.keyMetrics.basicValidation = {
        successRate: basic.successRate,
        errors: basic.totalErrors,
        warnings: basic.totalWarnings
      };
      
      // Calculate overall score
      summary.overallScore += basic.successRate * 0.4; // 40% weight
    }
    
    if (this.results.tests.openGraphValidation) {
      const og = this.results.tests.openGraphValidation.summary;
      summary.keyMetrics.openGraph = {
        averageOGScore: og.averageOGScore,
        averageTwitterScore: og.averageTwitterScore
      };
      
      // Calculate overall score
      summary.overallScore += (og.averageOGScore + og.averageTwitterScore) / 2 * 0.4; // 40% weight
    }
    
    if (this.results.tests.performance) {
      const perf = this.results.tests.performance;
      const performanceScore = perf.averageLoadTime < 2000 ? 100 : 
                              perf.averageLoadTime < 3000 ? 80 : 
                              perf.averageLoadTime < 5000 ? 60 : 40;
      
      summary.keyMetrics.performance = {
        averageLoadTime: perf.averageLoadTime,
        performanceScore
      };
      
      summary.overallScore += performanceScore * 0.2; // 20% weight
    }
    
    summary.overallScore = Math.round(summary.overallScore);
    
    // Determine status
    if (summary.overallScore >= 90) {
      summary.status = 'excellent';
    } else if (summary.overallScore >= 80) {
      summary.status = 'good';
    } else if (summary.overallScore >= 70) {
      summary.status = 'fair';
    } else {
      summary.status = 'needs-improvement';
    }
    
    return summary;
  }

  /**
   * Print comprehensive master report
   */
  printMasterReport() {
    console.log(`\n📊 MASTER TESTING REPORT`);
    console.log(`${'='.repeat(60)}`);
    
    // Overall Score
    const summary = this.results.summary;
    console.log(`\n🎯 Overall Score: ${summary.overallScore}/100 (${summary.status})`);
    
    // Key Metrics
    console.log(`\n📈 Key Metrics:`);
    if (summary.keyMetrics.basicValidation) {
      const basic = summary.keyMetrics.basicValidation;
      console.log(`   • Basic Validation: ${basic.successRate}% success rate`);
      console.log(`   • Metadata Errors: ${basic.errors}`);
      console.log(`   • Metadata Warnings: ${basic.warnings}`);
    }
    
    if (summary.keyMetrics.openGraph) {
      const og = summary.keyMetrics.openGraph;
      console.log(`   • Open Graph Score: ${og.averageOGScore}%`);
      console.log(`   • Twitter Score: ${og.averageTwitterScore}%`);
    }
    
    if (summary.keyMetrics.performance) {
      const perf = summary.keyMetrics.performance;
      console.log(`   • Performance Score: ${perf.performanceScore}%`);
      console.log(`   • Average Load Time: ${perf.averageLoadTime}ms`);
    }
    
    // Recommendations
    console.log(`\n💡 Recommendations:`);
    this.results.recommendations.forEach((rec, index) => {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`\n   ${index + 1}. ${priority} ${rec.title}`);
      console.log(`      ${rec.description}`);
      console.log(`      Action: ${rec.action}`);
    });
    
    // External Testing Links
    console.log(`\n🔗 Quick Testing Links:`);
    console.log(`   Facebook Debugger: https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(this.baseUrl)}`);
    console.log(`   Twitter Validator: https://cards-dev.twitter.com/validator?url=${encodeURIComponent(this.baseUrl)}`);
    console.log(`   LinkedIn Inspector: https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(this.baseUrl)}`);
    console.log(`   Open Graph Preview: https://www.opengraph.xyz/?url=${encodeURIComponent(this.baseUrl)}`);
  }

  /**
   * Save comprehensive report
   */
  async saveReport(filename = 'social-media-master-report.json') {
    const reportPath = path.join(__dirname, filename);
    
    try {
      await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2), 'utf8');
      console.log(`\n📄 Master report saved to: ${reportPath}`);
    } catch (error) {
      console.error(`❌ Error saving report: ${error.message}`);
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const urlArg = args.find(arg => arg.startsWith('--url='));
  const fullSuite = args.includes('--full-suite');
  const generateReport = args.includes('--generate-report');
  const optimize = args.includes('--optimize');
  
  let baseUrl = DEFAULT_BASE_URL;
  if (urlArg) {
    baseUrl = urlArg.split('=')[1];
  }

  const masterTester = new SocialMediaMasterTester(baseUrl);

  if (fullSuite) {
    await masterTester.runFullSuite();
    
    if (generateReport) {
      await masterTester.saveReport();
    }
    
  } else {
    console.log(`🚀 Social Media Master Testing Suite`);
    console.log(`Usage:`);
    console.log(`  node scripts/social-media-master-test.js --full-suite`);
    console.log(`  node scripts/social-media-master-test.js --full-suite --generate-report`);
    console.log(`  node scripts/social-media-master-test.js --url=https://your-site.com --full-suite`);
    console.log(`\nOptions:`);
    console.log(`  --url=<URL>        Test specific base URL`);
    console.log(`  --full-suite       Run complete testing suite`);
    console.log(`  --generate-report  Save detailed JSON report`);
    console.log(`  --optimize         Include optimization suggestions`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SocialMediaMasterTester };
