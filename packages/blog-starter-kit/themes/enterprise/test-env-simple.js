// Simple test script to verify chatbot environment variables
console.log('🔍 Testing Chatbot Environment Variables...\n');

// Test OpenAI configuration
console.log('📝 OpenAI Configuration:');
console.log('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ SET' : '❌ NOT SET');
console.log('  OPENAI_ROUTER_MODEL_SMALL:', process.env.OPENAI_ROUTER_MODEL_SMALL || '❌ NOT SET');
console.log('  OPENAI_ROUTER_MODEL_RESPONSES:', process.env.OPENAI_ROUTER_MODEL_RESPONSES || '❌ NOT SET');

// Test Google Calendar configuration
console.log('\n📅 Google Calendar Configuration:');
console.log('  GOOGLE_CALENDAR_ID:', process.env.GOOGLE_CALENDAR_ID || '❌ NOT SET');
console.log('  GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? '✅ SET' : '❌ NOT SET');
console.log('  GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ SET' : '❌ NOT SET');
console.log('  GOOGLE_PROJECT_ID:', process.env.GOOGLE_PROJECT_ID || '❌ NOT SET');

// Test feature flags
console.log('\n🚀 Feature Flags:');
console.log('  NEXT_PUBLIC_FEATURE_SCHEDULING:', process.env.NEXT_PUBLIC_FEATURE_SCHEDULING || '❌ NOT SET');
console.log('  NEXT_PUBLIC_FEATURE_CASE_STUDY:', process.env.NEXT_PUBLIC_FEATURE_CASE_STUDY || '❌ NOT SET');
console.log('  NEXT_PUBLIC_FEATURE_CLIENT_INTAKE:', process.env.NEXT_PUBLIC_FEATURE_CLIENT_INTAKE || '❌ NOT SET');

// Test GitHub configuration
console.log('\n🐙 GitHub Configuration:');
console.log('  GITHUB_REPO_OWNER:', process.env.GITHUB_REPO_OWNER || '❌ NOT SET');
console.log('  GITHUB_REPO_NAME:', process.env.GITHUB_REPO_NAME || '❌ NOT SET');
console.log('  GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ SET' : '❌ NOT SET');

// Test email configuration
console.log('\n📧 Email Configuration:');
console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ SET' : '❌ NOT SET');

// Test server-side feature flags
console.log('\n⚙️ Server-side Feature Flags:');
console.log('  FEATURE_SCHEDULING:', process.env.FEATURE_SCHEDULING || '❌ NOT SET');
console.log('  FEATURE_CASE_STUDY:', process.env.FEATURE_CASE_STUDY || '❌ NOT SET');
console.log('  FEATURE_CLIENT_INTAKE:', process.env.FEATURE_CLIENT_INTAKE || '❌ NOT SET');

console.log('\n✅ Environment variable test complete!');
console.log('\n💡 If all required variables show "✅ SET", your chatbot should work properly.');
console.log('💡 If any show "❌ NOT SET", you may need to add them to your .env.local file.');
