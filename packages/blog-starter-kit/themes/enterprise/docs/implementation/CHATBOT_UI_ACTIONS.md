# Chatbot UI Actions System

This document explains how the chatbot can control the browser window to show modals and other UI elements.

## Overview

The chatbot now has the ability to trigger UI actions that can control the browser window, such as showing calendar modals, forms, or other interactive elements. This is implemented using OpenAI Function Calling with a custom UI action system.

## How It Works

### 1. Tool Definition

The chatbot has a new tool called `show_calendar_modal` that can be triggered when users ask about scheduling:

```typescript
{
  type: "function" as const,
  function: {
    name: 'show_calendar_modal',
    description: 'Display a calendar modal with available time slots for scheduling',
    parameters: {
      type: 'object',
      properties: {
        timezone: {
          type: 'string',
          description: 'User\'s timezone (e.g., America/New_York)',
          default: 'America/New_York'
        },
        days: {
          type: 'number',
          description: 'Number of days to look ahead (1-7)',
          default: 7
        },
        message: {
          type: 'string',
          description: 'Message to display with the calendar modal'
        }
      },
      required: ['timezone']
    }
  }
}
```

### 2. Tool Execution

When the tool is called, it:

1. Fetches real availability from Google Calendar
2. Returns a UI action object instead of just data
3. The frontend processes this action and shows the modal

```typescript
async function showCalendarModal(parameters: any) {
	const { timezone = 'America/New_York', days = 7, message } = parameters;

	try {
		// First, get the availability data
		const availabilityResult = await getAvailability({ timezone, days });

		// Return a UI action that the frontend can handle
		return {
			type: 'ui_action',
			action: 'show_calendar_modal',
			data: {
				availableSlots: availabilityResult.availableSlots,
				timezone: availabilityResult.timezone,
				businessHours: availabilityResult.businessHours,
				meetingDurations: availabilityResult.meetingDurations,
				message: message || 'Here are the available time slots for scheduling:',
			},
		};
	} catch (error) {
		console.error('Error showing calendar modal:', error);
		throw new Error('Failed to show calendar modal');
	}
}
```

### 3. Frontend Processing

The chatbot component processes UI actions in the response:

```typescript
const handleUIAction = (uiActions: UIAction[]) => {
	for (const action of uiActions) {
		switch (action.action) {
			case 'show_calendar_modal':
				setCalendarData(action.data);
				setIsCalendarModalOpen(true);
				break;
			default:
				console.log('Unknown UI action:', action.action);
		}
	}
};
```

### 4. Modal Display

The calendar modal is rendered with the fetched data:

```typescript
{calendarData && (
  <CalendarModal
    isOpen={isCalendarModalOpen}
    onClose={() => setIsCalendarModalOpen(false)}
    availableSlots={calendarData.availableSlots}
    timezone={calendarData.timezone}
    businessHours={calendarData.businessHours}
    meetingDurations={calendarData.meetingDurations}
    message={calendarData.message}
    onSlotSelect={handleCalendarSlotSelect}
  />
)}
```

## User Experience Flow

1. **User asks about scheduling**: "I'd like to schedule a meeting"
2. **Chatbot recognizes intent**: Uses NLP to understand scheduling request
3. **Permission check**: System checks if user has granted UI permissions
4. **Permission request** (if needed): Shows permission modal asking for consent
5. **Tool is triggered**: Calls `show_calendar_modal` with appropriate parameters
6. **Real data is fetched**: Gets actual availability from Google Calendar
7. **Modal appears**: User sees a beautiful calendar interface with real time slots
8. **User selects time**: Can choose from available slots
9. **Booking flow continues**: Can proceed to book the selected time

## Benefits

- **Seamless Integration**: Works within the existing chatbot flow
- **Real-time Data**: Shows actual availability from Google Calendar
- **Responsive Design**: Modal works on all device sizes
- **Timezone Support**: Handles different user timezones
- **Extensible**: Easy to add more UI actions in the future
- **Privacy-First**: Permission-based system ensures user control
- **Transparent**: Clear permission requests with detailed explanations

## Permission System

The chatbot implements a privacy-first permission system that ensures users maintain control over UI actions:

### How Permissions Work

1. **First Time**: When the chatbot wants to show a UI element, it asks for permission
2. **Permission Modal**: Shows a clear explanation of what the chatbot wants to do
3. **User Choice**: User can allow or deny the action
4. **Remembered**: The choice is stored in localStorage for future interactions
5. **Manageable**: Users can reset permissions anytime through settings

### Permission States

- **Not Set**: First time interaction, will show permission request
- **Allowed**: UI actions will execute immediately
- **Denied**: UI actions will be ignored silently

### Managing Permissions

Users can manage permissions through the settings modal (gear icon in chatbot header):

- View current permission status
- Reset permissions to ask again
- Toggle voice settings

## Testing

Visit `/test-calendar-modal` to test the functionality. Try these commands:

- "Show me available meeting times"
- "I'd like to schedule a meeting"
- "Can you show me your calendar?"
- "What times are you available this week?"

## Future Enhancements

This system can be extended to support other UI actions:

- **Forms**: Show contact forms, intake forms
- **Galleries**: Display portfolio images
- **Videos**: Play demo videos
- **Maps**: Show location information
- **Charts**: Display analytics or data visualizations

## Technical Architecture

```
User Input → Chatbot → OpenAI → Function Call → Tool Execution → UI Action → Frontend → Modal Display
```

The system maintains the conversational flow while adding powerful UI control capabilities.
