const { google } = require('googleapis');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupGmailOAuth() {
  console.log('🔐 Gmail OAuth Setup Script\n');
  
  // Get credentials from user
  const clientId = await askQuestion('Enter your Google Client ID: ');
  const clientSecret = await askQuestion('Enter your Google Client Secret: ');
  
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'http://localhost:3000/api/google/oauth/callback'
  );

  // Generate the authorization URL
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  console.log('\n📋 Step 1: Authorize your application');
  console.log('Copy and paste this URL into your browser:\n');
  console.log(authUrl);
  console.log('\n');

  // Get the authorization code
  const code = await askQuestion('Enter the authorization code from the redirect URL: ');
  
  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n✅ OAuth setup successful!');
    console.log('\n📝 Add these to your .env.local file:\n');
    console.log(`GOOGLE_CLIENT_ID=${clientId}`);
    console.log(`GOOGLE_CLIENT_SECRET=${clientSecret}`);
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GOOGLE_CALENDAR_ID=${tokens.email || 'your_email@gmail.com'}`);
    
    if (tokens.access_token) {
      console.log('\n🔑 Access token (temporary):', tokens.access_token);
    }
    
    console.log('\n💡 The refresh token will allow your app to access Gmail without re-authorization.');
    
  } catch (error) {
    console.error('❌ Error getting tokens:', error.message);
  }
  
  rl.close();
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Run the setup
setupGmailOAuth().catch(console.error);
