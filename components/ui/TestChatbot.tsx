'use client';

export default function TestChatbot() {
  return (
    <div className="fixed top-4 right-4 z-[10000] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
      <h3 className="font-bold">Test Chatbot Component</h3>
      <p className="text-sm">This is a simple test component</p>
      <button 
        className="mt-2 bg-white text-blue-500 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100"
        onClick={() => alert('Test button clicked!')}
      >
        Test Button
      </button>
    </div>
  );
}


