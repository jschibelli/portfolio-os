// Test script to verify Google Calendar API configuration
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Google Calendar API Configuration...\n');

// Check environment variables
const requiredVars = [
  'GOOGLE_CALENDAR_ID',
  'GOOGLE_TYPE',
  'GOOGLE_PROJECT_ID',
  'GOOGLE_PRIVATE_KEY_ID',
  'GOOGLE_PRIVATE_KEY',
  'GOOGLE_CLIENT_EMAIL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_AUTH_URI',
  'GOOGLE_TOKEN_URI',
  'GOOGLE_AUTH_PROVIDER_X509_CERT_URL',
  'GOOGLE_CLIENT_X509_CERT_URL',
  'GOOGLE_UNIVERSE_DOMAIN'
];

console.log('📋 Environment Variables Check:');
let allVarsSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: SET`);
  } else {
    console.log(`  ❌ ${varName}: NOT SET`);
    allVarsSet = false;
  }
});

console.log('\n🔧 Configuration Details:');
console.log(`  Project ID: ${process.env.GOOGLE_PROJECT_ID}`);
console.log(`  Client Email: ${process.env.GOOGLE_CLIENT_EMAIL}`);
console.log(`  Calendar ID: ${process.env.GOOGLE_CALENDAR_ID}`);
console.log(`  Universe Domain: ${process.env.GOOGLE_UNIVERSE_DOMAIN}`);

if (allVarsSet) {
  console.log('\n✅ All required environment variables are set!');
  console.log('\n📅 Next Steps:');
  console.log('  1. Make sure your Google Calendar is shared with:');
  console.log(`     ${process.env.GOOGLE_CLIENT_EMAIL}`);
  console.log('  2. Give the service account "Make changes to events" permission');
  console.log('  3. Restart your development server');
  console.log('  4. Test the meeting scheduling feature');
} else {
  console.log('\n❌ Some environment variables are missing!');
  console.log('   Please check your .env.local file and ensure all variables are set.');
}

console.log('\n�� Test complete!');
