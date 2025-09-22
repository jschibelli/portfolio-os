// Gmail Integration Adapter
// Docs: https://developers.google.com/workspace/gmail/api/guides
// Server-only - uses configured OAuth credentials

import { google } from 'googleapis';

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  snippet?: string;
  internalDate: string;
  isRead?: boolean;
  isStarred?: boolean;
  folder?: string;
  to?: string;
  body?: string;
  bodyHtml?: string;
  bodyText?: string;
  attachments?: string[];
}

export interface GmailMessageDetail {
  headers: Record<string, string>;
  bodyHtml?: string;
  bodyText?: string;
}

export interface GmailSendRequest {
  to: string;
  subject: string;
  bodyHtml?: string;
  bodyText?: string;
  inReplyTo?: string;
}

export interface GmailSendResponse {
  id: string;
}

// Get OAuth client for Gmail API
async function getGmailClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials not configured. Please check your environment variables.');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google/oauth/callback'
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  // Get a fresh access token
  const { token: accessToken } = await oauth2Client.getAccessToken();
  if (!accessToken) {
    throw new Error('Failed to get access token from refresh token');
  }

  return oauth2Client;
}

// Helper function to handle Gmail API errors gracefully
function handleGmailError(error: any, operation: string): never {
  if (error.code === 403 && error.message?.includes('Insufficient Permission')) {
    throw new Error(
      `Gmail API access denied. Your OAuth credentials don't have sufficient permissions for ${operation}. ` +
      'Please update your Google Cloud Console OAuth scopes to include: ' +
      'https://www.googleapis.com/auth/gmail.readonly, ' +
      'https://www.googleapis.com/auth/gmail.modify, ' +
      'https://www.googleapis.com/auth/gmail.send'
    );
  }
  
  if (error.code === 401) {
    throw new Error(
      'Gmail API authentication failed. Your OAuth refresh token may have expired. ' +
      'Please run the setup script to get fresh credentials.'
    );
  }
  
  throw new Error(`Gmail API error (${operation}): ${error.message || 'Unknown error'}`);
}

export async function listStarred(limit: number = 20, pageToken?: string): Promise<{ messages: GmailMessage[], nextPageToken?: string }> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:starred',
      maxResults: limit,
      pageToken: pageToken,
    });

    const messages = response.data.messages || [];
    const nextPageToken = response.data.nextPageToken;
    
    // Get details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (msg: any) => {
        try {
          const detail = await getMessage(msg.id);
          return {
            id: msg.id,
            threadId: msg.threadId,
            subject: detail.headers.subject || '(No Subject)',
            from: detail.headers.from || 'Unknown',
            snippet: detail.headers.snippet || '',
            internalDate: detail.headers.internalDate || msg.internalDate || '',
            isRead: !detail.headers['x-gmail-labels']?.includes('UNREAD'),
            isStarred: true,
            folder: 'inbox',
            to: detail.headers.to || '',
            body: detail.bodyText || detail.bodyHtml || '',
            bodyHtml: detail.bodyHtml,
            bodyText: detail.bodyText,
          };
        } catch (error) {
          // If we can't get message details, return basic info
          return {
            id: msg.id,
            threadId: msg.threadId,
            subject: '(Unable to load subject)',
            from: 'Unknown',
            snippet: 'Message content unavailable',
            internalDate: msg.internalDate || new Date().toISOString(),
            isRead: false,
            isStarred: true,
            folder: 'inbox',
            to: '',
            body: '',
            bodyHtml: '',
            bodyText: '',
          };
        }
      })
    );

    return {
      messages: detailedMessages,
      nextPageToken: nextPageToken || undefined
    };
  } catch (error: any) {
    handleGmailError(error, 'listing starred emails');
  }
}

export async function listUnread(limit: number = 20, pageToken?: string): Promise<{ messages: GmailMessage[], nextPageToken?: string }> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: limit,
      pageToken: pageToken,
    });

    const messages = response.data.messages || [];
    const nextPageToken = response.data.nextPageToken;
    
    // Get details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (msg: any) => {
        try {
          const detail = await getMessage(msg.id);
          return {
            id: msg.id,
            threadId: msg.threadId,
            subject: detail.headers.subject || '(No Subject)',
            from: detail.headers.from || 'Unknown',
            snippet: detail.headers.snippet || '',
            internalDate: detail.headers.internalDate || msg.internalDate || '',
            isRead: false,
            isStarred: detail.headers['x-gmail-labels']?.includes('STARRED') || false,
            folder: 'inbox',
            to: detail.headers.to || '',
            body: detail.bodyText || detail.bodyHtml || '',
            bodyHtml: detail.bodyHtml,
            bodyText: detail.bodyText,
          };
        } catch (error) {
          // If we can't get message details, return basic info
          return {
            id: msg.id,
            threadId: msg.threadId,
            subject: '(Unable to load subject)',
            from: 'Unknown',
            snippet: 'Message content unavailable',
            internalDate: msg.internalDate || new Date().toISOString(),
            isRead: false,
            isStarred: false,
            folder: 'inbox',
            to: '',
            body: '',
            bodyHtml: '',
            bodyText: '',
          };
        }
      })
    );

    return {
      messages: detailedMessages,
      nextPageToken: nextPageToken || undefined
    };
  } catch (error: any) {
    handleGmailError(error, 'listing unread emails');
  }
}

export async function listEmailsByFolder(folder: string, limit: number = 20, pageToken?: string): Promise<{ messages: GmailMessage[], nextPageToken?: string }> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    let query = '';
    switch (folder) {
      case 'inbox':
        query = 'in:inbox';
        break;
      case 'sent':
        query = 'in:sent';
        break;
      case 'drafts':
        query = 'in:drafts';
        break;
      case 'spam':
        query = 'in:spam';
        break;
      case 'trash':
        query = 'in:trash';
        break;
      default:
        query = 'in:inbox';
    }

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: limit,
      pageToken: pageToken,
    });

    const messages = response.data.messages || [];
    const nextPageToken = response.data.nextPageToken;
    console.log(`Found ${messages.length} messages in ${folder}, nextPageToken: ${nextPageToken ? 'yes' : 'no'}`);
    
    // Get details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (msg: any) => {
        try {
          const detail = await getMessage(msg.id);
          console.log(`Message ${msg.id} details:`, {
            subject: detail.headers.subject,
            from: detail.headers.from,
            internalDate: detail.headers.internalDate,
            bodyHtml: detail.bodyHtml ? 'Has HTML' : 'No HTML',
            bodyText: detail.bodyText ? 'Has Text' : 'No Text'
          });
          
          return {
            id: msg.id,
            threadId: msg.threadId,
            subject: detail.headers.subject || '(No Subject)',
            from: detail.headers.from || 'Unknown',
            snippet: msg.snippet ?? detail.headers.snippet ?? '',
            internalDate: detail.headers.internalDate || msg.internalDate || '',
            isRead: !detail.headers['x-gmail-labels']?.includes('UNREAD'),
            isStarred: detail.headers['x-gmail-labels']?.includes('STARRED') || false,
            folder: folder,
            to: detail.headers.to || '',
            body: detail.bodyText || detail.bodyHtml || '',
            bodyHtml: detail.bodyHtml,
            bodyText: detail.bodyText,
          };
        } catch (error) {
          console.error(`Error getting details for message ${msg.id}:`, error);
          // If we can't get message details, return basic info
          return {
            id: msg.id,
            threadId: msg.threadId,
            subject: '(Unable to load subject)',
            from: 'Unknown',
            snippet: 'Message content unavailable',
            internalDate: msg.internalDate || new Date().toISOString(),
            isRead: false,
            isStarred: false,
            folder: folder,
            to: '',
            body: '',
            bodyHtml: '',
            bodyText: '',
          };
        }
      })
    );

    return {
      messages: detailedMessages,
      nextPageToken: nextPageToken || undefined
    };
  } catch (error: any) {
    handleGmailError(error, `listing emails from folder ${folder}`);
  }
}

export async function getMessage(id: string): Promise<GmailMessageDetail> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const response = await gmail.users.messages.get({
      userId: 'me',
      id: id,
      format: 'full',
    });

    const message = response.data;
    const headers: Record<string, string> = {};
    
    // Extract headers
    if (message.payload?.headers) {
      message.payload.headers.forEach((header: any) => {
        headers[header.name.toLowerCase()] = header.value;
      });
    }

    // Extract body content
    let bodyHtml: string | undefined;
    let bodyText: string | undefined;

    if (message.payload?.body?.data) {
      const bodyData = message.payload.body.data;
      const decodedBody = Buffer.from(bodyData, 'base64').toString();
      
      if (message.payload.mimeType === 'text/html') {
        bodyHtml = decodedBody;
      } else if (message.payload.mimeType === 'text/plain') {
        bodyText = decodedBody;
      }
    } else if (message.payload?.parts) {
      // Handle multipart messages
      for (const part of message.payload.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          bodyHtml = Buffer.from(part.body.data, 'base64').toString();
        } else if (part.mimeType === 'text/plain' && part.body?.data) {
          bodyText = Buffer.from(part.body.data, 'base64').toString();
        }
      }
    }

    // Add internalDate to headers so it gets passed through
    if (message.internalDate) {
      headers.internalDate = message.internalDate;
    }

    return {
      headers,
      bodyHtml,
      bodyText,
    };
  } catch (error: any) {
    handleGmailError(error, 'getting message details');
  }
}

export async function sendEmail(request: GmailSendRequest): Promise<GmailSendResponse> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Create RFC 2822 formatted email
    const emailLines = [
      `From: ${process.env.AUTH_ADMIN_EMAIL || 'noreply@example.com'}`,
      `To: ${request.to}`,
      `Subject: ${request.subject}`,
      '',
      request.bodyText || request.bodyHtml || '',
    ];

    if (request.inReplyTo) {
      emailLines.splice(3, 0, `In-Reply-To: ${request.inReplyTo}`);
    }

    const email = emailLines.join('\r\n');
    const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    return { id: response.data.id || '' };
  } catch (error: any) {
    handleGmailError(error, 'sending email');
  }
}

export async function markAsRead(id: string): Promise<void> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    await gmail.users.messages.modify({
      userId: 'me',
      id: id,
      requestBody: {
        removeLabelIds: ['UNREAD'],
      },
    });
  } catch (error: any) {
    handleGmailError(error, 'marking email as read');
  }
}

export async function toggleStar(id: string): Promise<void> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // First check if it's already starred
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: id,
    });

    const isStarred = message.data.labelIds?.includes('STARRED');

    if (isStarred) {
      // Remove star
      await gmail.users.messages.modify({
        userId: 'me',
        id: id,
        requestBody: {
          removeLabelIds: ['STARRED'],
        },
      });
    } else {
      // Add star
      await gmail.users.messages.modify({
        userId: 'me',
        id: id,
        requestBody: {
          addLabelIds: ['STARRED'],
        },
      });
    }
  } catch (error: any) {
    handleGmailError(error, 'toggling star');
  }
}

export async function moveToTrash(id: string): Promise<void> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    await gmail.users.messages.trash({
      userId: 'me',
      id: id,
    });
  } catch (error: any) {
    handleGmailError(error, 'moving email to trash');
  }
}

export async function permanentlyDelete(id: string): Promise<void> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    await gmail.users.messages.delete({
      userId: 'me',
      id: id,
    });
  } catch (error: any) {
    handleGmailError(error, 'permanently deleting email');
  }
}

export async function restoreFromTrash(id: string): Promise<void> {
  try {
    const oauth2Client = await getGmailClient();
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    await gmail.users.messages.untrash({
      userId: 'me',
      id: id,
    });
  } catch (error: any) {
    handleGmailError(error, 'restoring email from trash');
  }
}
