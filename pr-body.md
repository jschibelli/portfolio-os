Fixes #281

## Summary
This PR implements proper error handling for the contact form to fix the critical issue where email failures were being returned as success to users.

## Changes Made

### 1. Email Service (`lib/email-service.ts`)
- Added custom error classes (EmailConfigError, EmailNetworkError, EmailRateLimitError, EmailValidationError)
- Updated sendEmail() to throw errors instead of returning error objects
- Enhanced error detection and categorization in Resend integration
- Added proper JSDoc annotations with @throws documentation

### 2. API Route (`app/api/contact/route.ts`)
- Imported custom error classes
- Wrapped email sending in try/catch block
- Return appropriate HTTP status codes (500, 429, 503)
- Provide detailed, user-friendly error messages
- Include fallback email address in all error responses

### 3. Frontend (`app/contact/page.tsx`)
- Added ErrorResponse interface for typed error handling
- Enhanced error state management with errorDetails
- Implemented context-specific error messages based on error type
- Added retry functionality for transient errors
- Display fallback email with direct mailto link
- Added Try Again and Email Directly action buttons
- Improved error message persistence

## Error Scenarios Handled
1. Configuration Errors: Missing/invalid API keys
2. Rate Limit Errors: Too many submissions
3. Network Errors: Connection issues
4. Validation Errors: Invalid input

## User Experience Improvements
- Users now receive clear, actionable error messages
- Fallback email address displayed in all error scenarios
- Retry functionality for transient errors
- Direct Email Directly button for easy fallback
- No more false success messages when emails fail

## Acceptance Criteria Met
- Email failures return appropriate HTTP status codes
- Users see meaningful, context-specific error messages
- Fallback email address provided in error scenarios
- Error types properly categorized
- Retry functionality added for appropriate errors
- Improved user-facing error guidance

