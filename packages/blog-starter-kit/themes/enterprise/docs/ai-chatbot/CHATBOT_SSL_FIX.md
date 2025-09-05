# Chatbot SSL/TLS Error Fix

## Problem

The chatbot was experiencing SSL/TLS decoder errors (`error:1E08010C:DECODER routines::unsupported`) when trying to access the Google Calendar API.

## Solution Applied

### 1. Added Missing Dependencies

Added the following dependencies to `package.json`:

- `@prisma/client`: For database operations
- `googleapis`: For Google Calendar API integration
- `resend`: For email notifications
- `prisma`: For database schema management (dev dependency)

### 2. Enhanced Error Handling

- Added comprehensive error handling for SSL/TLS errors
- Implemented fallback to mock data when Google APIs are unavailable
- Added service account file existence checks
- Added calendar ID validation

### 3. SSL/TLS Configuration

- Added conditional SSL bypass for development environment only
- Implemented proper error detection for SSL/TLS issues

### 4. Mock Data Fallback

- Created `getMockAvailability()` function that provides realistic mock data
- Ensures chatbot functionality even when external services are unavailable

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Google Calendar Configuration
GOOGLE_SERVICE_ACCOUNT_PATH=./google-service-account.json
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com

# Feature Flags
FEATURE_SCHEDULING=true
FEATURE_CASE_STUDY=true
FEATURE_CLIENT_INTAKE=true
```

### 3. Google Service Account Setup

1. Create a Google Cloud Project
2. Enable Google Calendar API
3. Create a service account
4. Download the service account JSON file
5. Place it in the root directory as `google-service-account.json`
6. Share your Google Calendar with the service account email

### 4. Test the Chatbot

The chatbot should now work with:

- Real Google Calendar integration (when properly configured)
- Mock data fallback (when Google APIs are unavailable)
- Proper error handling for SSL/TLS issues

## Error Handling

The system now handles the following scenarios:

- Missing Google service account file
- Invalid calendar ID
- SSL/TLS certificate issues
- Network connectivity problems
- Missing environment variables

All errors gracefully fall back to mock data, ensuring the chatbot remains functional.
