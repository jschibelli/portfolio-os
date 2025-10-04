#!/usr/bin/env node

/**
 * Social Media Links Generator
 * 
 * Generates direct links to external social media testing tools
 * for quick validation of Open Graph and Twitter Card metadata.
 * 
 * Usage:
 *   node scripts/social-media-links-generator.js
 *   node scripts/social-media-links-generator.js --url https://your-site.com/page
 *   node scripts/social-media-links-generator.js --all-pages
 */

const { URL } = require('url');

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

// Social Media Testing Tools
const TESTING_TOOLS = {
  facebook: {
    name: 'Facebook Sharing Debugger',
    baseUrl: 'https://developers.facebook.com/tools/debug/',
    params: 'q',
    description: 'Test Open Graph tags for Facebook sharing'
  },
  twitter: {
    name: 'Twitter Card Validator',
    baseUrl: 'https://cards-dev.twitter.com/validator',
    params: 'url',
    description: 'Validate Twitter Card metadata'
  },
  linkedin: {
    name: 'LinkedIn Post Inspector',
    baseUrl: 'https://www.linkedin.com/post-inspector/inspect/',
    params: null,
    description: 'Test how content appears on LinkedIn'
  },
  openGraph: {
    name: 'Open Graph Preview',
    baseUrl: 'https://www.opengraph.xyz/',
    params: 'url',
    description: 'General Open Graph tag preview and validation'
  },
  whatsapp: {
    name: 'WhatsApp Link Preview',
    baseUrl: 'https://developers.facebook.com/tools/debug/',
    params: 'q',
    description: 'Test how links appear in WhatsApp (uses Facebook OG)'
  },
  slack: {
    name: 'Slack Link Preview',
    baseUrl: 'https://api.slack.com/methods/chat.unfurl/test',
    params: 'url',
    description: 'Test Slack unfurling (requires Slack app setup)'
  },
  discord: {
    name: 'Discord Embed Preview',
    baseUrl: 'https://discord.com/channels/@me',
    params: null,
    description: 'Test Discord embed preview (manual testing required)'
  }
};

class SocialMediaLinksGenerator {
  constructor(baseUrl = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Generate testing URLs for a given page URL
   */
  generateTestingUrls(pageUrl) {
    const testingUrls = {};
    
    Object.entries(TESTING_TOOLS).forEach(([key, tool]) => {
      let testingUrl;
      
      if (tool.params) {
        const url = new URL(tool.baseUrl);
        url.searchParams.set(tool.params, pageUrl);
        testingUrl = url.toString();
      } else {
        // For tools that don't use query parameters
        testingUrl = tool.baseUrl + encodeURIComponent(pageUrl);
      }
      
      testingUrls[key] = {
        ...tool,
        testingUrl
      };
    });
    
    return testingUrls;
  }

  /**
   * Print testing URLs for a single page
   */
  printPageTestingUrls(pagePath) {
    const pageUrl = `${this.baseUrl}${pagePath}`;
    const testingUrls = this.generateTestingUrls(pageUrl);
    
    console.log(`\n🔗 Testing URLs for: ${pageUrl}`);
    console.log(`${'='.repeat(60)}`);
    
    Object.entries(testingUrls).forEach(([key, tool]) => {
      console.log(`\n📱 ${tool.name}`);
      console.log(`   ${tool.description}`);
      console.log(`   🔗 ${tool.testingUrl}`);
    });
  }

  /**
   * Print testing URLs for all configured pages
   */
  printAllTestingUrls() {
    console.log(`🚀 Social Media Testing Links Generator`);
    console.log(`Base URL: ${this.baseUrl}`);
    console.log(`Total Pages: ${TEST_PAGES.length}`);
    
    TEST_PAGES.forEach(pagePath => {
      this.printPageTestingUrls(pagePath);
    });
    
    this.printTestingTips();
  }

  /**
   * Print helpful testing tips
   */
  printTestingTips() {
    console.log(`\n💡 TESTING TIPS`);
    console.log(`${'='.repeat(60)}`);
    
    console.log(`\n🔍 Facebook Sharing Debugger:`);
    console.log(`   • Click "Scrape Again" to refresh cached data`);
    console.log(`   • Check for any warnings or errors`);
    console.log(`   • Verify OG image loads correctly`);
    console.log(`   • Test both HTTP and HTTPS versions`);
    
    console.log(`\n🐦 Twitter Card Validator:`);
    console.log(`   • Verify card type is appropriate (summary_large_image recommended)`);
    console.log(`   • Check image dimensions (1200x630 optimal)`);
    console.log(`   • Ensure creator and site handles are correct`);
    
    console.log(`\n💼 LinkedIn Post Inspector:`);
    console.log(`   • LinkedIn uses Open Graph tags primarily`);
    console.log(`   • Test with both personal and company posts`);
    console.log(`   • Verify professional appearance`);
    
    console.log(`\n📊 General Best Practices:`);
    console.log(`   • OG images should be 1200x630px minimum`);
    console.log(`   • Title should be 60-95 characters`);
    console.log(`   • Description should be 120-200 characters`);
    console.log(`   • Use HTTPS for all URLs`);
    console.log(`   • Test on mobile devices`);
    
    console.log(`\n🔄 Caching Notes:`);
    console.log(`   • Social platforms cache OG data`);
    console.log(`   • Changes may take 24-48 hours to appear`);
    console.log(`   • Use debugger tools to force refresh`);
    console.log(`   • Consider using versioned image URLs for updates`);
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport() {
    let markdown = `# Social Media Testing Report\n\n`;
    markdown += `Generated for: ${this.baseUrl}\n`;
    markdown += `Date: ${new Date().toISOString().split('T')[0]}\n\n`;
    
    markdown += `## Testing Tools\n\n`;
    Object.entries(TESTING_TOOLS).forEach(([key, tool]) => {
      markdown += `### ${tool.name}\n`;
      markdown += `${tool.description}\n\n`;
      markdown += `Base URL: ${tool.baseUrl}\n\n`;
    });
    
    markdown += `## Page Testing URLs\n\n`;
    TEST_PAGES.forEach(pagePath => {
      const pageUrl = `${this.baseUrl}${pagePath}`;
      const testingUrls = this.generateTestingUrls(pageUrl);
      
      markdown += `### ${pagePath || 'Homepage'}\n\n`;
      markdown += `**URL:** ${pageUrl}\n\n`;
      
      Object.entries(testingUrls).forEach(([key, tool]) => {
        markdown += `- **${tool.name}:** [Test Link](${tool.testingUrl})\n`;
      });
      
      markdown += `\n`;
    });
    
    markdown += `## Testing Checklist\n\n`;
    markdown += `- [ ] All pages load without errors\n`;
    markdown += `- [ ] OG images display correctly\n`;
    markdown += `- [ ] Titles and descriptions are appropriate length\n`;
    markdown += `- [ ] Twitter Cards validate successfully\n`;
    markdown += `- [ ] LinkedIn previews look professional\n`;
    markdown += `- [ ] All URLs use HTTPS\n`;
    markdown += `- [ ] Images meet dimension requirements (1200x630)\n`;
    markdown += `- [ ] No broken links or missing assets\n`;
    
    return markdown;
  }

  /**
   * Save markdown report to file
   */
  async saveMarkdownReport(filename = 'social-media-testing-report.md') {
    const fs = require('fs').promises;
    const path = require('path');
    
    const reportPath = path.join(__dirname, filename);
    const markdown = this.generateMarkdownReport();
    
    try {
      await fs.writeFile(reportPath, markdown, 'utf8');
      console.log(`\n📄 Markdown report saved to: ${reportPath}`);
    } catch (error) {
      console.error(`❌ Error saving report: ${error.message}`);
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const urlArg = args.find(arg => arg.startsWith('--url='));
  const allPages = args.includes('--all-pages');
  const saveReport = args.includes('--save-report');
  
  let baseUrl = DEFAULT_BASE_URL;
  if (urlArg) {
    baseUrl = urlArg.split('=')[1];
  }

  const generator = new SocialMediaLinksGenerator(baseUrl);

  if (allPages) {
    generator.printAllTestingUrls();
    if (saveReport) {
      await generator.saveMarkdownReport();
    }
  } else if (urlArg) {
    const url = new URL(baseUrl);
    generator.printPageTestingUrls(url.pathname + url.search + url.hash);
  } else {
    console.log(`🔗 Social Media Links Generator`);
    console.log(`Usage:`);
    console.log(`  node scripts/social-media-links-generator.js --url=https://your-site.com/page`);
    console.log(`  node scripts/social-media-links-generator.js --all-pages`);
    console.log(`  node scripts/social-media-links-generator.js --all-pages --save-report`);
    console.log(`\nOptions:`);
    console.log(`  --url=<URL>     Test specific page URL`);
    console.log(`  --all-pages     Generate links for all configured pages`);
    console.log(`  --save-report   Save markdown report to file`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SocialMediaLinksGenerator };
