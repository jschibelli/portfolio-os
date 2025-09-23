# Comprehensive Chatbot Documentation for Analysis

## Executive Summary

This document provides a complete overview of an AI-powered chatbot system built for John Schibelli's professional portfolio website. The chatbot serves as an intelligent assistant that helps visitors learn about John's background, schedule meetings, view case studies, and submit project inquiries. The system is built on modern web technologies with comprehensive AI integration, voice capabilities, and automated workflow management.

## Core System Architecture

### Technology Stack

- **Frontend**: Next.js 13+ with TypeScript, Tailwind CSS, React Hooks
- **Backend**: Next.js API routes, OpenAI GPT-4o-mini, Google Calendar API
- **Database**: PostgreSQL with Prisma ORM
- **AI Services**: OpenAI API (GPT-4o-mini, TTS-1, Function Calling)
- **External APIs**: Google Calendar, GitHub, Resend (email)
- **Hosting**: Vercel with Postgres database

### System Components

1. **Main Chatbot Component** (`components/ui/Chatbot.tsx`)
2. **API Endpoints** (`pages/api/chat.ts`, `pages/api/tts.ts`, etc.)
3. **Tool System** (`pages/api/chat/tools.ts`)
4. **UI Modals** (Calendar, Contact Form, Booking, Case Studies)
5. **Analytics System** (`components/ui/ChatbotAnalytics.tsx`)

## Feature Analysis

### 1. Core AI Conversation System

**Implementation Status**: ✅ Fully Functional
**Technology**: OpenAI GPT-4o-mini with Function Calling

**Capabilities**:

- Natural language processing and understanding
- Context-aware conversations with memory
- Intent detection (contact, skills, experience, projects, hiring, scheduling)
- Page context awareness (understands current page content)
- Conversation history management (last 5 exchanges)
- Fallback responses when API unavailable

**Key Features**:

- Personality: Professional, friendly AI assistant representing John Schibelli
- Knowledge Base: Resume data, blog articles, case studies
- Response Templates: Pre-defined responses for common questions
- Error Handling: Graceful degradation with fallback content

**Code Example**:

```typescript
// System prompt includes personality, knowledge base, and conversation guidelines
const createSystemPrompt = (articles, conversationHistory, pageContext) => {
	return `You are John's AI assistant - a knowledgeable, friendly, and professional helper...
  PERSONALITY & COMMUNICATION STYLE:
  - Friendly and welcoming, but professional
  - Enthusiastic about John's work and achievements
  - Helpful and informative without being pushy
  - Use conversational language with technical accuracy`;
};
```

### 2. Voice and Speech Features

**Implementation Status**: ✅ Fully Functional
**Technology**: OpenAI TTS-1, Web Speech API, HTML5 Audio

**Capabilities**:

- Text-to-Speech: 6 voice options (alloy, echo, fable, onyx, nova, shimmer)
- Speech-to-Text: Browser-based voice recognition
- Voice Control: Toggle on/off with visual indicators
- Audio Management: Automatic playback and cleanup
- Voice Preferences: User-selectable voice options

**Key Features**:

- Default: Voice disabled (user preference)
- Natural-sounding voices (not robotic)
- Automatic audio element management
- Error handling for unsupported browsers
- Voice state persistence

**Code Example**:

```typescript
const speakMessage = async (text: string) => {
	if (!isVoiceEnabled) return;

	const response = await fetch('/api/tts', {
		method: 'POST',
		body: JSON.stringify({ text, voice: selectedOpenAIVoice }),
	});

	const audioBlob = await response.blob();
	const audioUrl = URL.createObjectURL(audioBlob);
	audioRef.src = audioUrl;
	await audioRef.play();
};
```

### 3. Scheduling and Calendar Integration

**Implementation Status**: ✅ Fully Functional with Fallbacks
**Technology**: Google Calendar API, Service Account Authentication

**Capabilities**:

- Real-time availability checking from Google Calendar
- Meeting booking with contact collection
- Time zone support (UTC-5 Eastern Time)
- Business hours: 9 AM - 5 PM ET, weekdays only
- Meeting durations: 30-minute and 60-minute options
- Interactive booking modals
- Email confirmations via Resend API
- Fallback to mock data when Google Calendar unavailable

**Key Features**:

- Automatic time slot generation
- Conflict detection with existing calendar events
- Contact information collection
- Booking confirmation workflow
- Calendar event creation with Google Meet links
- Reminder system (30 minutes before)

**Code Example**:

```typescript
// Tool definition for scheduling
{
  name: 'show_booking_modal',
  description: 'Display a calendar modal with available time slots',
  parameters: {
    timezone: { type: 'string', default: 'America/New_York' },
    days: { type: 'number', default: 7 },
    message: { type: 'string' }
  }
}
```

### 4. Case Study System

**Implementation Status**: ✅ Fully Functional
**Technology**: Structured data with dynamic content display

**Capabilities**:

- Interactive case study content display
- Chapter navigation (overview, challenge, solution, architecture, results, lessons)
- Available case studies: Shopify demo
- Content management system
- View tracking for analytics

**Key Features**:

- Dynamic content loading
- Chapter-based navigation
- Rich content formatting
- Engagement tracking
- Responsive design

**Code Example**:

```typescript
// Case study tool
{
  name: 'get_case_study_chapter',
  description: 'Get a specific chapter from a case study',
  parameters: {
    caseStudyId: { type: 'string', required: true },
    chapterId: { type: 'string', required: true }
  }
}
```

### 5. Client Intake and Lead Management

**Implementation Status**: ✅ Fully Functional
**Technology**: Prisma ORM, PostgreSQL database

**Capabilities**:

- Comprehensive project inquiry forms
- Data collection: name, email, company, role, project details, budget, timeline
- Link management for portfolios and references
- Lead storage with database persistence
- Status tracking (NEW, CONTACTED, etc.)

**Key Features**:

- Form validation and sanitization
- Database storage with Prisma
- Lead status management
- Email notifications
- Data export capabilities

**Database Schema**:

```sql
model Lead {
  id        Int       @id @default(autoincrement())
  name      String
  email     String
  company   String?
  role      String?
  project   String
  budget    String?
  timeline  String?
  links     String?
  notes     String?
  status    String
  createdAt DateTime  @default(now())
}
```

### 6. Analytics and Tracking System

**Implementation Status**: ✅ Fully Functional
**Technology**: Local storage, event tracking system

**Capabilities**:

- Conversation analytics (starts, messages, intents)
- User behavior tracking (popular actions, common intents)
- Engagement metrics (average messages per conversation)
- Event logging system
- Local storage for client-side analytics

**Key Features**:

- Real-time analytics dashboard
- Intent detection tracking
- Action click tracking
- Conversation duration tracking
- User satisfaction metrics (placeholder)

**Code Example**:

```typescript
export const trackConversationStart = () => {
	if ((window as any).trackChatbotEvent) {
		(window as any).trackChatbotEvent({
			type: 'conversation_start',
			data: { timestamp: new Date().toISOString() },
		});
	}
};
```

### 7. UI/UX Features

**Implementation Status**: ✅ Fully Functional
**Technology**: React, Tailwind CSS, Lucide React icons

**Capabilities**:

- Responsive design (mobile-first)
- Accessibility features (ARIA labels, keyboard navigation)
- Dark/light theme support
- Quick action buttons
- Loading states and visual feedback
- Error handling with user-friendly messages
- Permission system for browser features

**Key Features**:

- Floating chat interface
- Message threading with timestamps
- Suggested actions for common tasks
- Modal system for complex interactions
- Voice control indicators
- Settings panel

**Code Example**:

```typescript
// Suggested actions system
{message.suggestedActions && message.suggestedActions.map((action, index) => (
  <button
    key={index}
    onClick={() => handleSuggestedAction(action)}
    className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
  >
    <span>{action.icon}</span>
    <span>{action.label}</span>
    <ExternalLink className="h-3 w-3" />
  </button>
))}
```

### 8. Content Integration

**Implementation Status**: ✅ Fully Functional
**Technology**: GitHub API, fallback content system

**Capabilities**:

- GitHub repository integration for blog articles
- Resume data integration
- Dynamic content updates
- Content categorization
- Fallback content when external sources unavailable

**Key Features**:

- Article fetching from GitHub
- Content categorization (React, TypeScript, etc.)
- Recent articles display
- Article summaries and links
- Fallback to static content

## Environment Configuration

### Required Environment Variables

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Google Calendar Configuration
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
GOOGLE_TYPE=service_account
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id

# Database Configuration
DATABASE_URL=your-postgres-connection-string

# Feature Flags
NEXT_PUBLIC_FEATURE_SCHEDULING=true
NEXT_PUBLIC_FEATURE_CASE_STUDY=true
NEXT_PUBLIC_FEATURE_CLIENT_INTAKE=true
```

### Optional Environment Variables

```env
# GitHub Integration
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-articles-repository
GITHUB_TOKEN=your-github-personal-access-token

# Email Configuration
RESEND_API_KEY=your-resend-api-key

# Development
DISABLE_SSL_VERIFICATION=true
FIX_SSL_ISSUES=true
```

## Database Schema

### Booking Table

```sql
model Booking {
  id            Int       @id @default(autoincrement())
  name          String
  email         String
  timezone      String
  startTime     DateTime
  endTime       DateTime
  meetingType   String?
  notes         String?
  status        String
  googleEventId String?
  reminder24hSent Boolean  @default(false)
  reminder10mSent Boolean  @default(false)
  followupSent   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Lead Table

```sql
model Lead {
  id        Int       @id @default(autoincrement())
  name      String
  email     String
  company   String?
  role      String?
  project   String
  budget    String?
  timeline  String?
  links     String?
  notes     String?
  status    String
  createdAt DateTime  @default(now())
}
```

### CaseStudyView Table

```sql
model CaseStudyView {
  id          Int       @id @default(autoincrement())
  caseStudyId String
  chapterId   String
  visitorId   String?
  viewedAt    DateTime
}
```

## API Endpoints

### Core Chat API (`/api/chat`)

- **Method**: POST
- **Purpose**: Main conversation endpoint
- **Features**: Intent detection, tool calling, response generation
- **Input**: message, conversationHistory, pageContext
- **Output**: response, intent, suggestedActions, uiActions

### Text-to-Speech API (`/api/tts`)

- **Method**: POST
- **Purpose**: Convert text to speech
- **Features**: Multiple voice options, audio streaming
- **Input**: text, voice
- **Output**: Audio MP3 file

### Availability API (`/api/availability`)

- **Method**: POST
- **Purpose**: Get calendar availability
- **Features**: Google Calendar integration, timezone support
- **Input**: timezone, days
- **Output**: availableSlots, businessHours, meetingDurations

### Booking API (`/api/book`)

- **Method**: POST
- **Purpose**: Create calendar bookings
- **Features**: Google Calendar event creation, email notifications
- **Input**: name, email, timezone, startTime, endTime, meetingType, notes
- **Output**: success, booking, message

### Intake API (`/api/intake`)

- **Method**: POST
- **Purpose**: Submit client leads
- **Features**: Form validation, database storage
- **Input**: name, email, company, message, source
- **Output**: success, lead

## Tool System (OpenAI Function Calling)

### Available Tools

1. **get_availability**: Fetch calendar availability
2. **book_meeting**: Create calendar bookings
3. **get_case_study_chapter**: Display case study content
4. **submit_client_intake**: Collect project inquiries
5. **show_calendar_modal**: Display booking interface
6. **show_booking_modal**: Show booking workflow
7. **show_booking_confirmation**: Confirm bookings
8. **collect_contact_info**: Gather contact information

### Tool Execution Flow

```typescript
// Tool execution in chat API
if (response.tool_calls && response.tool_calls.length > 0) {
	for (const toolCall of response.tool_calls) {
		const result = await executeTool(
			toolCall.function.name,
			JSON.parse(toolCall.function.arguments),
		);
		// Handle tool results and UI actions
	}
}
```

## User Experience Flow

### 1. Initial Interaction

- User clicks chat icon (bottom-right corner)
- Chatbot opens with welcome message
- Voice is disabled by default
- Quick actions may be displayed

### 2. Conversation Flow

- User types message or uses voice input
- AI processes intent and generates response
- Suggested actions appear if relevant
- UI actions trigger modals when needed

### 3. Scheduling Flow

- User requests meeting
- AI calls scheduling tool
- Calendar modal opens with available slots
- User selects time and provides contact info
- Booking confirmation sent
- Calendar event created

### 4. Case Study Flow

- User asks about case studies
- AI calls case study tool
- Interactive case study content displayed
- User can navigate between chapters
- View tracking recorded

### 5. Lead Generation Flow

- User expresses project interest
- AI calls client intake tool
- Form modal opens for project details
- Lead stored in database
- Follow-up email sent

## Security and Privacy

### Data Protection

- API keys stored in environment variables
- Input sanitization and validation
- HTTPS encryption for all communications
- Database connection security
- Rate limiting considerations

### Privacy Features

- No persistent user identification
- Conversation data not stored long-term
- GDPR-compliant data handling
- User consent for voice features
- Clear data usage policies

## Performance Optimization

### Frontend Optimizations

- React component memoization
- Efficient state management
- Lazy loading of modals
- Optimized audio handling
- Responsive image loading

### Backend Optimizations

- API response caching
- Database query optimization
- Efficient tool execution
- Error handling and fallbacks
- Rate limiting implementation

## Error Handling and Fallbacks

### Graceful Degradation

- Mock data when external APIs unavailable
- Fallback responses for AI failures
- Offline mode considerations
- Browser compatibility handling
- Progressive enhancement

### Error Recovery

- Automatic retry mechanisms
- User-friendly error messages
- Alternative action suggestions
- System health monitoring
- Logging and debugging

## Monitoring and Analytics

### System Health

- API endpoint monitoring
- Database connection status
- External service availability
- Error rate tracking
- Performance metrics

### User Analytics

- Conversation engagement
- Feature usage patterns
- Conversion tracking
- User satisfaction metrics
- A/B testing capabilities

## Future Roadmap

### Short-term Enhancements

- Advanced analytics dashboard
- Email template customization
- Multi-language support
- Mobile app development
- Enhanced voice features

### Long-term Vision

- CRM integration
- Advanced AI capabilities
- Video call integration
- White-label solution
- API marketplace

## Conclusion

This chatbot system represents a comprehensive, production-ready AI assistant with advanced capabilities including voice interaction, automated scheduling, lead generation, and content management. The system is built with modern web technologies, robust error handling, and extensive customization options. It serves as a complete solution for professional portfolio websites requiring intelligent user interaction and automated workflow management.

The system demonstrates best practices in AI integration, user experience design, and scalable architecture, making it suitable for deployment in professional environments with proper configuration and monitoring.
