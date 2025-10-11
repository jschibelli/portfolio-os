# Chatbot Component Architecture

## Overview
The chatbot has been modularized into smaller, reusable components for better maintainability and testability.

## Component Structure

### Core Components

#### `Chatbot.tsx` (Main Component)
- **Purpose**: Main orchestrator component
- **Responsibilities**: 
  - State management
  - Business logic coordination
  - API communication
  - Event handling
- **Lines**: ~2000+ (original monolithic component)

#### `ChatMessage.tsx`
- **Purpose**: Individual message display
- **Features**:
  - User/bot message rendering
  - Markdown support for bot messages
  - Suggested actions display
  - Case study content rendering
  - Timestamp formatting
- **Props**:
  - `message`: Message object
  - `onSuggestedAction`: Handler for action clicks
  - `onChapterChange`: Handler for case study chapter changes
  - `formatTime`: Time formatting function

#### `ChatInput.tsx`
- **Purpose**: Message input with controls
- **Features**:
  - Text input field
  - Voice input controls (mic button)
  - Send button
  - Close button
  - Quick reply suggestions
  - Loading states
- **Props**:
  - `inputValue`, `setInputValue`: Input state
  - `isLoading`, `isListening`, `isSpeaking`: Status flags
  - `quickReplies`: Context-aware suggestions
  - `onSend`, `onStartListening`, `onStopListening`, etc.: Event handlers

#### `ChatSettings.tsx`
- **Purpose**: Settings modal
- **Features**:
  - Voice settings (TTS enable/disable)
  - Voice selection (OpenAI voices)
  - UI permissions management
- **Props**:
  - `isOpen`, `onClose`: Modal state
  - `isVoiceEnabled`, `selectedVoice`: Voice settings
  - `uiPermissionGranted`: Permission state
  - Event handlers for all settings changes

### Type Definitions

#### `types.ts`
Centralized TypeScript interfaces:
- `Message`: Chat message structure
- `ConversationHistory`: Chat history format
- `PageContext`: Current page context
- `TimeSlot`, `CalendarData`: Calendar integration
- `ContactFormData`, `BookingData`: Form data
- `Features`: Feature flags
- `VoiceName`: Available voice options
- `ChatbotSettings`: Settings structure

## Usage

### Importing Components
```typescript
import {
  ChatMessage,
  ChatInput,
  ChatSettings,
  type Message,
  type VoiceName,
} from '@/components/features/chatbot';
```

### Example: Using ChatMessage
```typescript
<ChatMessage
  message={message}
  onSuggestedAction={handleSuggestedAction}
  onChapterChange={handleChapterChange}
  formatTime={formatTime}
/>
```

### Example: Using ChatInput
```typescript
<ChatInput
  inputValue={inputValue}
  setInputValue={setInputValue}
  isLoading={isLoading}
  isListening={isListening}
  isSpeaking={isSpeaking}
  quickReplies={quickReplies}
  inputRef={inputRef}
  onSend={sendMessage}
  onStartListening={startListening}
  onStopListening={stopListening}
  onStopSpeaking={stopSpeaking}
  onClose={() => setIsOpen(false)}
  onQuickReply={handleQuickReply}
  onKeyDown={handleKeyPress}
/>
```

### Example: Using ChatSettings
```typescript
<ChatSettings
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  isVoiceEnabled={isVoiceEnabled}
  selectedVoice={selectedOpenAIVoice}
  uiPermissionGranted={uiPermissionGranted}
  onToggleVoice={toggleVoice}
  onVoiceSelection={handleVoiceSelection}
  onResetUIPermission={resetUIPermission}
/>
```

## Benefits of Modularization

### 1. **Maintainability**
- Easier to locate and fix bugs
- Clear separation of concerns
- Smaller files are easier to understand

### 2. **Reusability**
- Components can be reused across different parts of the app
- Types can be imported and extended

### 3. **Testability**
- Individual components can be unit tested in isolation
- Mocking dependencies is simpler

### 4. **Performance**
- Components can be optimized independently
- Code splitting opportunities

### 5. **Developer Experience**
- Faster IDE performance with smaller files
- Better autocomplete and type inference
- Easier code reviews

## Migration Path

The original `Chatbot.tsx` file remains intact. New implementations can gradually adopt the modular components:

1. **Phase 1** (Current): Extract components and types
2. **Phase 2** (Future): Refactor `Chatbot.tsx` to use modular components
3. **Phase 3** (Future): Extract business logic into custom hooks
4. **Phase 4** (Future): Add comprehensive tests for each module

## File Structure
```
chatbot/
├── Chatbot.tsx              # Main component (orchestrator)
├── ChatMessage.tsx           # Message display component
├── ChatInput.tsx             # Input area component
├── ChatSettings.tsx          # Settings modal component
├── MarkdownRenderer.tsx      # Markdown rendering
├── types.ts                  # TypeScript definitions
├── index.ts                  # Module exports
└── README.md                 # This file
```

## Future Enhancements

### Planned Improvements
- [ ] Extract voice logic into `useVoice` hook
- [ ] Create `useChat` hook for message management
- [ ] Add unit tests for each component
- [ ] Create Storybook stories for visual testing
- [ ] Add PropTypes documentation
- [ ] Performance optimization with React.memo
- [ ] Accessibility improvements (ARIA labels)

### Potential New Components
- `ChatHeader.tsx` - Extract header into separate component
- `ChatMessageList.tsx` - Virtualized message list for performance
- `QuickReplyButton.tsx` - Individual quick reply button
- `VoiceControl.tsx` - Dedicated voice control component
- `LoadingIndicator.tsx` - Reusable loading states

## Contributing

When adding new features:
1. Consider if it belongs in an existing component or needs a new one
2. Update types in `types.ts` as needed
3. Export new components/types in `index.ts`
4. Update this README with usage examples
5. Follow existing patterns for props and event handlers

## Related Documentation
- [TipTap Editor Implementation](../../../TIPTAP_EDITOR_IMPLEMENTATION.md)
- [Complete Embed System](../../../COMPLETE_EMBED_SYSTEM.md)
- [Advanced Media Management](../../../ADVANCED_MEDIA_MANAGEMENT.md)

