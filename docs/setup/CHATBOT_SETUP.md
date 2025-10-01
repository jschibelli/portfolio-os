# Chatbot Setup Guide

This project includes an AI-powered chatbot that uses John's resume data as its knowledge base. The chatbot is powered by OpenAI's GPT-3.5-turbo model and provides conversational access to John's professional background.

## Features

- 🤖 AI-powered responses using OpenAI GPT-3.5-turbo
- 📊 Knowledge base derived from John's resume data
- 🎨 Custom styled to match the site's design system
- 📱 Fully responsive with mobile support
- ♿ Accessibility-focused design
- 🔄 Fallback responses when API is unavailable
- 🔒 Secure API key handling

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Customize the chatbot behavior
# CHATBOT_MODEL=gpt-3.5-turbo
# CHATBOT_MAX_TOKENS=500
# CHATBOT_TEMPERATURE=0.7
```

### 2. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key and paste it in your `.env.local` file

### 3. Install Dependencies

The required dependencies are already included in the project:
- `openai` - OpenAI API client
- `lucide-react` - Icons for the UI

### 4. Data Source

The chatbot uses the resume data from `data/resume.json`. To update the chatbot's knowledge:

1. Edit `data/resume.json` with updated information
2. The chatbot will automatically use the new data on the next deployment

## Usage

### For Users

1. Click the chat icon in the bottom-right corner of any page
2. Type your question about John's background, skills, or experience
3. The AI will respond based on the resume data
4. Close the chat by clicking the X button

### For Developers

#### Adding the Chatbot to New Pages

```tsx
import Chatbot from "@/components/ui/Chatbot";

export default function YourPage() {
  return (
    <>
      {/* Your page content */}
      <Chatbot />
    </>
  );
}
```

#### Customizing the Chatbot

The chatbot can be customized by modifying:

- **API Route**: `app/api/chat/route.ts` - Backend logic and OpenAI integration
- **Component**: `components/ui/Chatbot.tsx` - UI and user interaction
- **Data**: `data/resume.json` - Knowledge base content

#### Updating the Knowledge Base

1. Edit `data/resume.json` with new information
2. The system prompt in `app/api/chat/route.ts` will automatically include the updated data
3. Deploy the changes

## Architecture

### Components

- **Chatbot Component** (`components/ui/Chatbot.tsx`)
  - Handles UI state and user interactions
  - Manages message history
  - Provides loading states and error handling

- **API Route** (`app/api/chat/route.ts`)
  - Processes chat requests
  - Integrates with OpenAI API
  - Provides fallback responses

- **Data Source** (`data/resume.json`)
  - Centralized knowledge base
  - JSON Resume format for easy maintenance

### Security Features

- API keys stored in environment variables
- Input validation and sanitization
- Error handling with fallback responses
- Rate limiting considerations (can be added)

### Accessibility Features

- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- High contrast design
- Semantic HTML structure

## Troubleshooting

### Common Issues

1. **Chatbot not responding**
   - Check if `OPENAI_API_KEY` is set in `.env.local`
   - Verify the API key is valid and has credits
   - Check browser console for errors

2. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts

3. **API errors**
   - Verify OpenAI API key permissions
   - Check rate limits and usage quotas
   - Review network connectivity

### Development Tips

- Use browser dev tools to inspect network requests
- Check the browser console for JavaScript errors
- Test with different screen sizes for responsiveness
- Verify accessibility with screen readers

## Future Enhancements

Potential improvements for the chatbot:

- [ ] Conversation history persistence
- [ ] File upload support for additional context
- [ ] Multi-language support
- [ ] Advanced analytics and insights
- [ ] Integration with contact forms
- [ ] Custom training with additional data sources
- [ ] Voice input/output capabilities
- [ ] Advanced conversation flow management

## Support

For technical support or questions about the chatbot implementation, please refer to the project documentation or contact the development team.
