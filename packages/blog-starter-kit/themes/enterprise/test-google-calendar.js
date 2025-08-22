// Test Google Calendar API directly
require('dotenv').config({ path: '.env.local' });

async function testGoogleCalendar() {
  console.log('🧪 Testing Google Calendar API...\n');
  
  try {
    // Test environment variables
    console.log('Environment variables:');
    console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
    console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
    console.log('GOOGLE_CALENDAR_ID:', process.env.GOOGLE_CALENDAR_ID ? '✅ Set' : '❌ Missing');
    console.log('FIX_SSL_ISSUES:', process.env.FIX_SSL_ISSUES);
    
    // Test the createGoogleAuthClient function
    const { createGoogleAuthClient } = require('./pages/api/chat/tools');
    
    console.log('\n🔍 Testing Google Auth Client...');
    const auth = await createGoogleAuthClient();
    console.log('✅ Google Auth Client created successfully');
    
    // Test calendar access
    const { google } = require('googleapis');
    const calendar = google.calendar({ version: 'v3', auth });
    
    console.log('\n🔍 Testing Calendar API...');
    const now = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    const response = await calendar.freebusy.query({
      auth: auth,
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
        timeZone: 'America/New_York',
      },
    });
    
    console.log('✅ Calendar API working!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGoogleCalendar();
