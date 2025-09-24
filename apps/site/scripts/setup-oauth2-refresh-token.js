#!/usr/bin/env node

/**
 * OAuth2 Refresh Token Setup Script
 * This script helps you obtain a refresh token for Google Calendar API access
 * 
 * Run with: node scripts/setup-oauth2-refresh-token.js
 */

const https = require('https');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Try to load environment variables from .env.local
(() => {
  try {
    // Optional dependency: use if available
    const dotenv = require('dotenv');
    const rootEnv = path.resolve(process.cwd(), '.env.local');
    const appEnv = path.resolve(process.cwd(), 'apps/site/.env.local');

    if (fs.existsSync(rootEnv)) {
      dotenv.config({ path: rootEnv });
      console.log('📄 Loaded environment from .env.local');
    } else if (fs.existsSync(appEnv)) {
      dotenv.config({ path: appEnv });
      console.log('📄 Loaded environment from apps/site/.env.local');
    } else {
      // Fall back to default .env if present
      dotenv.config();
    }
  } catch (_) {
    // dotenv not installed; rely on process environment
  }
})();

// Configuration
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/oauth/callback';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: data ? 'POST' : 'GET',
      headers: data ? {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      } : {}
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: json });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

function generateAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    // Gmail scopes for reading, modifying, and sending mail
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'
  ].join(' ');
  
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: scopes,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent'
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function exchangeCodeForTokens(code) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const data = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI
  });
  
  return await makeRequest(tokenUrl, data.toString());
}

async function main() {
  log('🔐 Google Calendar OAuth2 Refresh Token Setup', 'bold');
  log('===============================================', 'blue');
  
  // Check environment variables
  if (!CLIENT_ID || !CLIENT_SECRET) {
    log('❌ Missing required environment variables:', 'red');
    log('   GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set', 'yellow');
    log('\nAdd these to your .env.local file:', 'blue');
    log('GOOGLE_CLIENT_ID=your-client-id', 'blue');
    log('GOOGLE_CLIENT_SECRET=your-client-secret', 'blue');
    log('GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/oauth/callback', 'blue');
    process.exit(1);
  }
  
  log(`✅ Client ID: ${CLIENT_ID}`, 'green');
  log(`✅ Client Secret: ${CLIENT_SECRET.substring(0, 8)}...`, 'green');
  log(`✅ Redirect URI: ${REDIRECT_URI}`, 'green');
  
  // Generate authorization URL
  const authUrl = generateAuthUrl();
  
  log('\n📋 Follow these steps:', 'blue');
  log('1. Open this URL in your browser:', 'blue');
  log(`   ${authUrl}`, 'yellow');
  log('\n2. Sign in with your Google account', 'blue');
  log('3. Grant permissions for Calendar access', 'blue');
  log('4. Copy the authorization code from the redirect URL', 'blue');
  
  // Get authorization code from user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const code = await new Promise((resolve) => {
    rl.question('\n📝 Enter the authorization code: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
  
  if (!code) {
    log('❌ No authorization code provided', 'red');
    process.exit(1);
  }
  
  log('\n🔄 Exchanging authorization code for tokens...', 'blue');
  
  try {
    const response = await exchangeCodeForTokens(code);
    
    if (response.status === 200 && response.data.access_token) {
      log('✅ Successfully obtained tokens!', 'green');
      log('\n📋 Add these to your .env.local file:', 'blue');
      log(`GOOGLE_OAUTH_REFRESH_TOKEN=${response.data.refresh_token}`, 'green');
      
      if (response.data.access_token) {
        log(`GOOGLE_OAUTH_ACCESS_TOKEN=${response.data.access_token}`, 'green');
        log('\n💡 Note: Access tokens expire, but refresh tokens are long-lived', 'yellow');
      }
      
      log('\n🎉 OAuth2 setup complete!', 'green');
      log('Your chatbot can now access Google Calendar.', 'green');
      
    } else {
      log('❌ Failed to exchange authorization code:', 'red');
      log(`Status: ${response.status}`, 'red');
      log(`Response: ${JSON.stringify(response.data, null, 2)}`, 'red');
    }
    
  } catch (error) {
    log(`❌ Error exchanging authorization code: ${error.message}`, 'red');
  }
}

// Run the setup
main().catch((error) => {
  log(`❌ Setup error: ${error.message}`, 'red');
  process.exit(1);
});
