// Threads Integration Adapter
// Docs: https://developers.facebook.com/docs/threads/
// Server-only - uses OAuth user token via Auth.js session

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface ThreadsPublishRequest {
  text: string;
  mediaUrl?: string;
}

export interface ThreadsPublishResponse {
  id: string;
}

// Get OAuth client for Threads API
async function getThreadsClient() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error('No valid session found');
  }

  return {
    accessToken: session.accessToken,
  };
}

export async function publishThread(request: ThreadsPublishRequest): Promise<ThreadsPublishResponse> {
  try {
    const client = await getThreadsClient();
    
    // Note: Threads API is still in development and may require different endpoints
    // This is a placeholder implementation based on Instagram's API structure
    
    // First, get the user's Instagram business account ID (required for Threads)
    const accountResponse = await fetch(
      'https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=' + client.accessToken,
      {
        method: 'GET',
      }
    );

    if (!accountResponse.ok) {
      throw new Error(`Threads API error: ${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();
    const instagramAccountId = accountData.data?.[0]?.instagram_business_account?.id;

    if (!instagramAccountId) {
      throw new Error('No Instagram business account found');
    }

    // Prepare the post data
    const postData: any = {
      caption: request.text,
      access_token: client.accessToken,
    };

    if (request.mediaUrl) {
      // For media posts, we'd need to first upload the media
      // This is a simplified version
      postData.media_type = 'IMAGE';
      postData.image_url = request.mediaUrl;
    }

    // Publish the post (this would be to Threads via Instagram API)
    // Note: The actual endpoint may differ as Threads API evolves
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }
    );

    if (!publishResponse.ok) {
      throw new Error(`Threads API error: ${publishResponse.status}`);
    }

    const data = await publishResponse.json();
    
    // If media was uploaded, publish it
    if (request.mediaUrl && data.id) {
      const publishMediaResponse = await fetch(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creation_id: data.id,
            access_token: client.accessToken,
          }),
        }
      );

      if (!publishMediaResponse.ok) {
        throw new Error(`Threads media publish error: ${publishMediaResponse.status}`);
      }

      const publishData = await publishMediaResponse.json();
      return { id: publishData.id };
    }

    return { id: data.id };
  } catch (error) {
    console.error('Error publishing to Threads:', error);
    throw error;
  }
}
