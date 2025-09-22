// Facebook Integration Adapter
// Docs: https://developers.facebook.com/docs/pages-api/posts/
// Server-only - uses OAuth user token via Auth.js session

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface FacebookPublishRequest {
  pageId: string;
  message: string;
  link?: string;
}

export interface FacebookPublishResponse {
  id: string;
}

// Get OAuth client for Facebook API
async function getFacebookClient() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error('No valid session found');
  }

  return {
    accessToken: session.accessToken,
  };
}

export async function publishPagePost(request: FacebookPublishRequest): Promise<FacebookPublishResponse> {
  try {
    const client = await getFacebookClient();
    
    // First, exchange user token for page token if needed
    const pageTokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/${request.pageId}?fields=access_token&access_token=${client.accessToken}`,
      {
        method: 'GET',
      }
    );

    if (!pageTokenResponse.ok) {
      throw new Error(`Facebook API error: ${pageTokenResponse.status}`);
    }

    const pageTokenData = await pageTokenResponse.json();
    const pageAccessToken = pageTokenData.access_token;

    // Prepare the post data
    const postData: any = {
      message: request.message,
      access_token: pageAccessToken,
    };

    if (request.link) {
      postData.link = request.link;
    }

    // Publish the post to the page
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${request.pageId}/feed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }
    );

    if (!publishResponse.ok) {
      throw new Error(`Facebook API error: ${publishResponse.status}`);
    }

    const data = await publishResponse.json();
    return { id: data.id };
  } catch (error) {
    console.error('Error publishing to Facebook:', error);
    throw error;
  }
}
