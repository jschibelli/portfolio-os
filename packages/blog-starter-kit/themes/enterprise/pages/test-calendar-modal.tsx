import React from 'react';
import Head from 'next/head';
import Chatbot from '../components/ui/Chatbot';

export default function TestCalendarModal() {
  return (
    <>
      <Head>
        <title>Test Calendar Modal - Chatbot UI Actions</title>
        <meta name="description" content="Testing the chatbot's ability to trigger calendar modals" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Chatbot Calendar Modal Test
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                How to Test
              </h2>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  This page demonstrates how the chatbot can control the browser window to show a calendar modal.
                </p>
                
                                 <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                   <h3 className="font-medium text-blue-800 mb-2">Try these commands:</h3>
                                      <ul className="space-y-2 text-blue-700">
                     <li>• <strong>&ldquo;I&apos;d like to schedule a meeting with John&rdquo;</strong> (unified booking)</li>
                     <li>• <strong>&ldquo;Show me available meeting times&rdquo;</strong> (calendar only)</li>
                     <li>• <strong>&ldquo;Can you show me your calendar?&rdquo;</strong> (calendar only)</li>
                     <li>• <strong>&ldquo;What times are you available this week?&rdquo;</strong> (calendar only)</li>
                   </ul>
                 </div>
                
                                 <div className="bg-green-50 border-l-4 border-green-400 p-4">
                   <h3 className="font-medium text-green-800 mb-2">What happens:</h3>
                   <ol className="space-y-1 text-green-700">
                     <li>1. The chatbot recognizes your scheduling intent</li>
                     <li>2. It asks for permission to show a booking modal</li>
                     <li>3. If you allow, it fetches real availability from Google Calendar</li>
                     <li>4. A unified modal appears with contact form and calendar</li>
                     <li>5. You fill out contact info and select a time slot</li>
                     <li>6. Meeting is automatically scheduled with Google Meet</li>
                     <li>7. Confirmation email sent with video conferencing link</li>
                   </ol>
                 </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="font-medium text-yellow-800 mb-2">Technical Details:</h3>
                  <ul className="space-y-1 text-yellow-700 text-sm">
                    <li>• Uses OpenAI Function Calling to trigger UI actions</li>
                    <li>• Permission-based system for user privacy and control</li>
                    <li>• Real-time Google Calendar integration</li>
                    <li>• Responsive modal with timezone support</li>
                    <li>• Seamless integration with existing chatbot flow</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                  <h3 className="font-medium text-purple-800 mb-2">Privacy & Control:</h3>
                  <ul className="space-y-1 text-purple-700 text-sm">
                    <li>• The chatbot will ask for permission before showing any modals</li>
                    <li>• You can manage permissions in the settings (gear icon)</li>
                    <li>• Your choice is remembered for future interactions</li>
                    <li>• You can reset permissions anytime</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Chatbot Interface
              </h2>
              <p className="text-gray-600 mb-4">
                Click the chat button in the bottom right to start testing the calendar modal functionality.
              </p>
            </div>
          </div>
        </div>
        
        {/* Chatbot Component */}
        <Chatbot />
      </div>
    </>
  );
}
