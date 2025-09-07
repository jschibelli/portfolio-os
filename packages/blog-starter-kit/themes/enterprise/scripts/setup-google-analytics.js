#!/usr/bin/env node

/**
 * Google Analytics Setup Helper
 * This script helps you find your Google Analytics Property ID and set up the integration
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔍 Google Analytics Setup Helper\n');

console.log('To get your Google Analytics Property ID:');
console.log('1. Go to https://analytics.google.com/');
console.log('2. Select your website property');
console.log('3. Go to Admin (gear icon) > Property > Property Settings');
console.log('4. Copy the "Property ID" (it looks like: 123456789)\n');

rl.question('Enter your Google Analytics Property ID: ', (propertyId) => {
  if (!propertyId || !/^\d+$/.test(propertyId)) {
    console.log('❌ Invalid Property ID. Please enter a numeric ID.');
    rl.close();
    return;
  }

  console.log('\n✅ Great! Your Property ID is:', propertyId);
  
  console.log('\n📝 Add these lines to your .env.local file:\n');
  console.log('# Google Analytics 4 Configuration');
  console.log(`GOOGLE_ANALYTICS_PROPERTY_ID=${propertyId}`);
  console.log('GOOGLE_ANALYTICS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com');
  console.log('GOOGLE_ANALYTICS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"');
  
  console.log('\n📚 Next steps:');
  console.log('1. Set up a Google Cloud service account (see docs/analytics-seo/google-analytics-setup.md)');
  console.log('2. Add the CLIENT_EMAIL and PRIVATE_KEY to your .env.local file');
  console.log('3. Restart your development server');
  console.log('4. Visit /admin/analytics to see real data!');
  
  rl.close();
});
