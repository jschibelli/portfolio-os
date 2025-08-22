const fetch = require('node-fetch');

async function testChatbot() {
  console.log('🧪 Testing Chatbot API...\n');

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'I want to schedule a meeting',
        conversationHistory: [],
        pageContext: null
      })
    });

    const data = await response.json();
    
    console.log('✅ Response Status:', response.status);
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    
    if (data.uiActions) {
      console.log('🎯 UI Actions found:', data.uiActions.length);
      data.uiActions.forEach((action, index) => {
        console.log(`  ${index + 1}. Action: ${action.action}`);
        console.log(`     Data:`, action.data);
      });
    } else {
      console.log('❌ No UI actions returned');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testChatbot();
