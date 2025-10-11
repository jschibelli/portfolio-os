# Chatbot TypeScript Types Documentation

## Overview
This document provides comprehensive documentation for all TypeScript types used in the AI Chatbot component.

## Table of Contents
- [Core Types](#core-types)
- [API Types](#api-types)
- [UI Component Types](#ui-component-types)
- [Configuration Types](#configuration-types)
- [Enum Types](#enum-types)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

## Core Types

### Message
The primary data structure for chat messages.

```typescript
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  suggestedActions?: SuggestedAction[];
  caseStudyContent?: {
    caseStudy: any;
    chapter: any;
    availableChapters: any[];
  };
  uiActions?: UIAction[];
}
```

**Usage Example:**
```typescript
const userMessage: Message = {
  id: Date.now().toString(),
  text: "Tell me about your projects",
  sender: 'user',
  timestamp: new Date(),
};

const botMessage: Message = {
  id: (Date.now() + 1).toString(),
  text: "I'd be happy to tell you about my projects!",
  sender: 'bot',
  timestamp: new Date(),
  intent: 'portfolio_inquiry',
  suggestedActions: [
    { label: 'View Projects', url: '/projects', icon: '🎨' }
  ],
};
```

**Fields:**
- `id`: Unique identifier (use `Date.now().toString()` or UUID)
- `text`: Message content (markdown supported for bot messages)
- `sender`: Either 'user' or 'bot'
- `timestamp`: JavaScript Date object
- `intent`: Optional AI-detected intent (e.g., 'scheduling', 'portfolio_inquiry')
- `suggestedActions`: Optional quick action buttons
- `caseStudyContent`: Optional case study details
- `uiActions`: Optional UI actions to trigger

### ConversationHistory
Stores conversation context for API requests.

```typescript
interface ConversationHistory {
  user: string;
  assistant: string;
}
```

**Usage Example:**
```typescript
const history: ConversationHistory[] = [
  {
    user: "What services do you offer?",
    assistant: "I offer full-stack development, AI integration, and consulting."
  },
  {
    user: "Tell me more about AI integration",
    assistant: "I specialize in chatbot development and LLM integration..."
  }
];

// Limit to last 15 exchanges (30 entries)
const recentHistory = history.slice(-15);
```

**Best Practice:**
- Always limit to last 15 exchanges to manage token usage
- Store plain text only (no HTML or markdown)
- Use for API context, not UI display

### PageContext
Provides context about the current page for AI responses.

```typescript
interface PageContext {
  title?: string;
  content?: string;
  url?: string;
  type?: 'home' | 'about' | 'work' | 'projects' | 'portfolio' | 'contact' | 'blog' | 'services' | 'case-study' | 'article' | 'page' | 'post';
  specificType?: string;
  pathname?: string;
}
```

**Usage Example:**
```typescript
const pageContext: PageContext = {
  title: "Tendril Case Study - Multi-Tenant Chatbot SaaS",
  content: "A comprehensive strategic analysis...",
  url: "https://example.com/projects/tendril",
  type: 'case-study',
  specificType: 'project',
  pathname: '/projects/tendril'
};
```

## API Types

### ChatAPIRequest
Request payload for the chat API endpoint.

```typescript
interface ChatAPIRequest {
  message: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  pageContext?: PageContext;
}
```

**Usage Example:**
```typescript
const requestBody: ChatAPIRequest = {
  message: "What's your experience with Next.js?",
  conversationHistory: conversationHistory.map(h => ({
    role: 'user',
    content: h.user,
    timestamp: new Date().toISOString()
  })),
  pageContext: {
    type: 'about',
    pathname: '/about'
  }
};

const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestBody)
});
```

### ChatAPIResponse
Response structure from the chat API.

```typescript
interface ChatAPIResponse {
  response: string;
  fallback?: string;
  intent?: string;
  suggestedActions?: SuggestedAction[];
  uiActions?: UIAction[];
  conversationId?: string;
}
```

**Usage Example:**
```typescript
const data: ChatAPIResponse = await response.json();

const botMessage: Message = {
  id: (Date.now() + 1).toString(),
  text: data.response || data.fallback || "I'm sorry, I couldn't process that.",
  sender: 'bot',
  timestamp: new Date(),
  intent: data.intent,
  suggestedActions: data.suggestedActions,
  uiActions: data.uiActions
};
```

## UI Component Types

### SuggestedAction
Quick action buttons displayed with bot messages.

```typescript
interface SuggestedAction {
  label: string;
  url: string;
  icon: string;
}
```

**Usage Example:**
```typescript
const actions: SuggestedAction[] = [
  {
    label: 'Schedule Meeting',
    url: '/schedule',
    icon: '📅'
  },
  {
    label: 'View Portfolio',
    url: '/projects',
    icon: '🎨'
  }
];

// Rendering
actions.map(action => (
  <button onClick={() => handleAction(action)}>
    <span>{action.icon}</span>
    <span>{action.label}</span>
  </button>
));
```

### UIAction
Programmatic UI actions triggered by the bot.

```typescript
interface UIAction {
  type: string;
  action: string;
  data: any;
}
```

**Usage Example:**
```typescript
const calendarAction: UIAction = {
  type: 'ui_action',
  action: 'show_booking_modal',
  data: {
    availableSlots: [...],
    timezone: 'America/New_York',
    businessHours: { start: 9, end: 18, timezone: 'America/New_York' },
    meetingDurations: [30, 60],
    message: 'Select a time for our meeting'
  }
};

// Handle in component
if (action.action === 'show_booking_modal') {
  setCalendarData(action.data);
  setIsCalendarModalOpen(true);
}
```

## Configuration Types

### Features
Feature flags for enabling/disabling chatbot capabilities.

```typescript
interface Features {
  scheduling: boolean;
  caseStudy: boolean;
  clientIntake: boolean;
}
```

**Usage Example:**
```typescript
const features: Features = {
  scheduling: process.env.NEXT_PUBLIC_FEATURE_SCHEDULING === 'true',
  caseStudy: process.env.NEXT_PUBLIC_FEATURE_CASE_STUDY === 'true',
  clientIntake: process.env.NEXT_PUBLIC_FEATURE_CLIENT_INTAKE === 'true'
};

// Conditional rendering
{features.scheduling && (
  <button onClick={handleSchedule}>Schedule Meeting</button>
)}
```

### ChatbotSettings
User preferences for the chatbot.

```typescript
interface ChatbotSettings {
  isVoiceEnabled: boolean;
  selectedVoice: VoiceName;
  uiPermissionGranted: boolean | null;
}
```

**Usage Example:**
```typescript
const settings: ChatbotSettings = {
  isVoiceEnabled: true,
  selectedVoice: 'shimmer',
  uiPermissionGranted: true
};

// Save to localStorage
localStorage.setItem('chatbot-voice-enabled', settings.isVoiceEnabled.toString());
localStorage.setItem('chatbot-openai-voice', settings.selectedVoice);
```

### VoiceName
Type-safe voice selection.

```typescript
type VoiceName = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
```

**Voice Characteristics:**
- **alloy**: Neutral, balanced voice
- **echo**: Male voice, clear and professional
- **fable**: Male voice, warm storytelling tone
- **onyx**: Male voice, deep and authoritative
- **nova**: Female voice, friendly and engaging
- **shimmer**: Female voice, bright and energetic

**Usage Example:**
```typescript
const [selectedVoice, setSelectedVoice] = useState<VoiceName>('shimmer');

function handleVoiceChange(voice: VoiceName) {
  setSelectedVoice(voice);
  localStorage.setItem('chatbot-openai-voice', voice);
}
```

## Enum Types

### ChatbotStorageKeys
LocalStorage keys used by the chatbot.

```typescript
enum ChatbotStorageKeys {
  MESSAGES = 'chatbot-messages',
  CONVERSATION_HISTORY = 'chatbot-conversation-history',
  CONVERSATION_ID = 'chatbot-conversation-id',
  VOICE_ENABLED = 'chatbot-voice-enabled',
  VOICE_SELECTION = 'chatbot-openai-voice',
  UI_PERMISSION = 'chatbot-ui-permission',
}
```

**Usage Example:**
```typescript
import { ChatbotStorageKeys } from './types';

// Save messages
localStorage.setItem(
  ChatbotStorageKeys.MESSAGES,
  JSON.stringify(messages)
);

// Load messages
const savedMessages = localStorage.getItem(ChatbotStorageKeys.MESSAGES);
if (savedMessages) {
  const parsed: Message[] = JSON.parse(savedMessages);
  setMessages(parsed);
}
```

### ChatbotEventType
Analytics event types.

```typescript
enum ChatbotEventType {
  CONVERSATION_START = 'conversation_start',
  MESSAGE_SENT = 'message_sent',
  INTENT_DETECTED = 'intent_detected',
  ACTION_CLICKED = 'action_clicked',
  CONVERSATION_END = 'conversation_end',
  VOICE_INPUT = 'voice_input',
  QUICK_REPLY = 'quick_reply',
  SETTINGS_CHANGED = 'settings_changed',
}
```

**Usage Example:**
```typescript
import { ChatbotEventType } from './types';

function trackEvent(eventType: ChatbotEventType, data?: any) {
  console.log(`[Analytics] ${eventType}`, data);
  // Send to analytics service
}

// Track events
trackEvent(ChatbotEventType.CONVERSATION_START, { userId: user.id });
trackEvent(ChatbotEventType.MESSAGE_SENT, { messageLength: message.length });
trackEvent(ChatbotEventType.QUICK_REPLY, { reply: selectedReply });
```

## Usage Examples

### Complete Chat Flow
```typescript
import {
  Message,
  ConversationHistory,
  PageContext,
  ChatAPIRequest,
  ChatAPIResponse,
} from './types';

async function sendMessage(
  userMessage: string,
  history: ConversationHistory[],
  context: PageContext
): Promise<Message> {
  // Create user message
  const userMsg: Message = {
    id: Date.now().toString(),
    text: userMessage,
    sender: 'user',
    timestamp: new Date(),
  };

  // Prepare API request
  const request: ChatAPIRequest = {
    message: userMessage,
    conversationHistory: history.map(h => ({
      role: 'user',
      content: h.user,
      timestamp: new Date().toISOString()
    })),
    pageContext: context
  };

  // Call API
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  const data: ChatAPIResponse = await response.json();

  // Create bot message
  const botMsg: Message = {
    id: (Date.now() + 1).toString(),
    text: data.response || "I'm sorry, I couldn't process that.",
    sender: 'bot',
    timestamp: new Date(),
    intent: data.intent,
    suggestedActions: data.suggestedActions,
    uiActions: data.uiActions
  };

  return botMsg;
}
```

### LocalStorage Persistence
```typescript
import { Message, ConversationHistory, ChatbotStorageKeys } from './types';

// Save to localStorage
function saveToStorage(messages: Message[], history: ConversationHistory[]) {
  try {
    localStorage.setItem(
      ChatbotStorageKeys.MESSAGES,
      JSON.stringify(messages)
    );
    localStorage.setItem(
      ChatbotStorageKeys.CONVERSATION_HISTORY,
      JSON.stringify(history)
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      // Handle quota exceeded
      const recentMessages = messages.slice(-20);
      const recentHistory = history.slice(-15);
      localStorage.setItem(
        ChatbotStorageKeys.MESSAGES,
        JSON.stringify(recentMessages)
      );
      localStorage.setItem(
        ChatbotStorageKeys.CONVERSATION_HISTORY,
        JSON.stringify(recentHistory)
      );
    }
  }
}

// Load from localStorage
function loadFromStorage(): {
  messages: Message[];
  history: ConversationHistory[];
} {
  try {
    const savedMessages = localStorage.getItem(ChatbotStorageKeys.MESSAGES);
    const savedHistory = localStorage.getItem(ChatbotStorageKeys.CONVERSATION_HISTORY);

    return {
      messages: savedMessages
        ? JSON.parse(savedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        : [],
      history: savedHistory ? JSON.parse(savedHistory) : []
    };
  } catch (error) {
    console.error('Error loading from storage:', error);
    return { messages: [], history: [] };
  }
}
```

## Best Practices

### 1. Type Safety
Always use the provided types instead of `any`:
```typescript
// ❌ Bad
const message: any = { text: "Hello" };

// ✅ Good
const message: Message = {
  id: '1',
  text: "Hello",
  sender: 'user',
  timestamp: new Date()
};
```

### 2. Optional Properties
Check for optional properties before using:
```typescript
// ❌ Bad
const intent = message.intent.toLowerCase();

// ✅ Good
const intent = message.intent?.toLowerCase() ?? 'unknown';
```

### 3. Type Assertions
Avoid type assertions unless absolutely necessary:
```typescript
// ❌ Bad
const voice = userInput as VoiceName;

// ✅ Good
const isValidVoice = (voice: string): voice is VoiceName => {
  return ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'].includes(voice);
};
const voice = isValidVoice(userInput) ? userInput : 'shimmer';
```

### 4. Date Handling
Always serialize/deserialize Date objects properly:
```typescript
// Serialize
const serialized = JSON.stringify({
  ...message,
  timestamp: message.timestamp.toISOString()
});

// Deserialize
const parsed: Message = {
  ...JSON.parse(serialized),
  timestamp: new Date(JSON.parse(serialized).timestamp)
};
```

### 5. Enum Usage
Use enums for consistency:
```typescript
// ❌ Bad
localStorage.getItem('chatbot-messages');

// ✅ Good
localStorage.getItem(ChatbotStorageKeys.MESSAGES);
```

## Type Guards

### isUserMessage
```typescript
function isUserMessage(message: Message): boolean {
  return message.sender === 'user';
}
```

### hasSuggestedActions
```typescript
function hasSuggestedActions(message: Message): boolean {
  return Boolean(message.suggestedActions && message.suggestedActions.length > 0);
}
```

### isValidVoice
```typescript
function isValidVoice(voice: string): voice is VoiceName {
  const validVoices: VoiceName[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  return validVoices.includes(voice as VoiceName);
}
```

## Migration Guide

If migrating from untyped code:

1. Import types at the top of your file:
```typescript
import type { Message, ConversationHistory, PageContext } from './types';
```

2. Add type annotations to variables:
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [history, setHistory] = useState<ConversationHistory[]>([]);
```

3. Type function parameters and return values:
```typescript
function formatTime(date: Date): string {
  return date.toLocaleTimeString();
}
```

4. Use enums instead of string literals:
```typescript
localStorage.getItem(ChatbotStorageKeys.MESSAGES);
trackEvent(ChatbotEventType.MESSAGE_SENT);
```

## Related Documentation
- [Component Architecture](./README.md)
- [Chat API Documentation](../../../../../docs/api/API_DOCUMENTATION.md)
- [Chatbot Implementation Guide](./TIPTAP_EDITOR_IMPLEMENTATION.md)

