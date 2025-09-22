#!/usr/bin/env node

/**
 * Google Analytics Access Token Helper
 * This script helps you get your Google Analytics access token
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 Google Analytics Access Token Helper\n');

console.log('To get your Google Analytics access token:');
console.log('1. Go to https://developers.google.com/oauthplayground/');
console.log('2. Click the gear icon (⚙️) in the top right');
console.log('3. In the left panel, find and select:');
console.log('   - https://www.googleapis.com/auth/analytics.readonly');
console.log('4. Click "Authorize APIs"');
console.log('5. Sign in with your Google account');
console.log('6. Click "Exchange authorization code for tokens"');
console.log('7. Copy the Access Token (starts with ya29.)\n');

rl.question('Enter your Google Analytics Access Token: ', (accessToken) => {
  if (!accessToken || !accessToken.startsWith('ya29.')) {
    console.log('❌ Invalid Access Token. Please enter a valid token that starts with "ya29."');
    rl.close();
    return;
  }

  console.log('\n✅ Great! Your Access Token is valid.');
  
  console.log('\n📝 Add this line to your .env.local file:\n');
  console.log(`GOOGLE_ANALYTICS_ACCESS_TOKEN=${accessToken}`);
  
  console.log('\n📚 Next steps:');
  console.log('1. Add the access token to your .env.local file');
  console.log('2. Restart your development server');
  console.log('3. Visit /admin/analytics to see real data!');
  
  console.log('\n⚠️  Important Notes:');
  console.log('- Access tokens expire after 1 hour');
  console.log('- You may need to refresh the token periodically');
  console.log('- Never commit your access token to version control');
  
  rl.close();
});
