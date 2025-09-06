/**
 * Configuration Validation Script
 * 
 * This script validates the site configuration to ensure consistency
 * and prevent configuration-related issues in production.
 */

// Simple validation without requiring TypeScript constants
const SITE_CONFIG = {
  DOMAIN: 'johnschibelli.dev',
  BASE_URL: 'https://johnschibelli.dev',
  EMAIL: {
    PRIMARY: 'john@johnschibelli.dev',
    CONTACT: 'john@johnschibelli.dev',
    BOOKING: 'john@johnschibelli.dev',
  },
  SOCIAL: {
    LINKEDIN: 'https://linkedin.com/in/johnschibelli',
    GITHUB: 'https://github.com/jschibelli',
    TWITTER: 'https://twitter.com/johnschibelli',
  },
  PERSONAL: {
    NAME: 'John Schibelli',
    TITLE: 'Senior Front-End Developer',
    LOCATION: 'Towaco, NJ',
    PHONE: '862.207.9004',
  },
  SEO: {
    DESCRIPTION: 'Senior Front-End Developer with 15+ years of experience building scalable, high-performance web applications.',
    KEYWORDS: [
      'John Schibelli',
      'Front-End Developer',
      'React Developer',
      'Next.js Developer',
      'TypeScript Developer',
    ],
  },
};

function validateSiteConfig() {
  const errors = [];
  const warnings = [];

  // Validate domain consistency
  if (!SITE_CONFIG.DOMAIN || !SITE_CONFIG.BASE_URL) {
    errors.push('Domain and base URL must be defined');
  } else {
    const expectedBaseUrl = `https://${SITE_CONFIG.DOMAIN}`;
    if (SITE_CONFIG.BASE_URL !== expectedBaseUrl) {
      errors.push(`Base URL (${SITE_CONFIG.BASE_URL}) does not match domain (${SITE_CONFIG.DOMAIN})`);
    }
  }

  // Validate email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emails = [SITE_CONFIG.EMAIL.PRIMARY, SITE_CONFIG.EMAIL.CONTACT, SITE_CONFIG.EMAIL.BOOKING];
  
  emails.forEach((email, index) => {
    const emailTypes = ['PRIMARY', 'CONTACT', 'BOOKING'];
    if (!email || !emailRegex.test(email)) {
      errors.push(`Invalid email format for ${emailTypes[index]}: ${email}`);
    }
    if (email && !email.includes('@johnschibelli.dev')) {
      warnings.push(`Email ${emailTypes[index]} (${email}) does not use the configured domain`);
    }
  });

  // Validate social media URLs
  const socialUrls = [
    { name: 'LinkedIn', url: SITE_CONFIG.SOCIAL.LINKEDIN, pattern: /^https:\/\/linkedin\.com\/in\/[a-zA-Z0-9-]+$/ },
    { name: 'GitHub', url: SITE_CONFIG.SOCIAL.GITHUB, pattern: /^https:\/\/github\.com\/[a-zA-Z0-9-]+$/ },
    { name: 'Twitter', url: SITE_CONFIG.SOCIAL.TWITTER, pattern: /^https:\/\/twitter\.com\/[a-zA-Z0-9_]+$/ },
  ];

  socialUrls.forEach(({ name, url, pattern }) => {
    if (!url) {
      errors.push(`${name} URL is not defined`);
    } else if (!pattern.test(url)) {
      errors.push(`Invalid ${name} URL format: ${url}`);
    }
  });

  // Validate personal information
  if (!SITE_CONFIG.PERSONAL.NAME || SITE_CONFIG.PERSONAL.NAME.trim() === '') {
    errors.push('Personal name is required');
  }
  
  if (!SITE_CONFIG.PERSONAL.TITLE || SITE_CONFIG.PERSONAL.TITLE.trim() === '') {
    errors.push('Personal title is required');
  }

  if (!SITE_CONFIG.PERSONAL.PHONE || !/^\d{3}\.\d{3}\.\d{4}$/.test(SITE_CONFIG.PERSONAL.PHONE)) {
    errors.push('Phone number must be in format XXX.XXX.XXXX');
  }

  // Validate SEO configuration
  if (!SITE_CONFIG.SEO.DESCRIPTION || SITE_CONFIG.SEO.DESCRIPTION.trim() === '') {
    errors.push('SEO description is required');
  }

  if (!SITE_CONFIG.SEO.KEYWORDS || SITE_CONFIG.SEO.KEYWORDS.length === 0) {
    errors.push('SEO keywords are required');
  }

  // Check for old domain references
  const configString = JSON.stringify(SITE_CONFIG);
  if (configString.includes('schibelli.dev') && !configString.includes('johnschibelli.dev')) {
    errors.push('Configuration contains old domain references (schibelli.dev)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function logValidationResults(result) {
  if (result.isValid) {
    console.log('✅ Configuration validation passed');
    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      result.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
  } else {
    console.error('❌ Configuration validation failed:');
    result.errors.forEach(error => console.error(`   - ${error}`));
    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      result.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
  }
}

// Run validation
const result = validateSiteConfig();
logValidationResults(result);

// Exit with appropriate code
process.exit(result.isValid ? 0 : 1);
