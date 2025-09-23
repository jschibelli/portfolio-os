// LinkedIn Integration Adapter
// Docs: https://learn.microsoft.com/linkedin/consumer/integrations/self-serve/share-on-linkedin
// Server-only - uses OAuth user token via Auth.js session

import { getServerSession } from 'next-auth';
import { authOptions } from '@mindware-blog/lib/auth-config';

export interface LinkedInPublishRequest {
  text: string;
  media?: {
    type: 'image' | 'link';
    url?: string;
  };
}

export interface LinkedInPublishResponse {
  id: string;
}

// Get OAuth client for LinkedIn API
async function getLinkedInClient() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error('No valid session found');
  }

  return {
    accessToken: session.accessToken,
  };
}

export async function publishUGC(request: LinkedInPublishRequest): Promise<LinkedInPublishResponse> {
  try {
    const client = await getLinkedInClient();
    
    // First, get the user's profile ID
    const profileResponse = await fetch(
      'https://api.linkedin.com/v2/me',
      {
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    if (!profileResponse.ok) {
      throw new Error(`LinkedIn API error: ${profileResponse.status}`);
    }

    const profileData = await profileResponse.json();
    const author = `urn:li:person:${profileData.id}`;

    // Prepare the post data
    const postData: any = {
      author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: request.text,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // Add media if provided
    if (request.media) {
      if (request.media.type === 'image' && request.media.url) {
        // For images, we'd need to first upload the image and get a media asset
        // This is a simplified version - in production you'd implement image upload
        postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            description: {
              text: request.text,
            },
            media: 'urn:li:digitalmediaAsset:...', // This would come from image upload
          },
        ];
      } else if (request.media.type === 'link' && request.media.url) {
        postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
        postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            description: {
              text: request.text,
            },
            originalUrl: request.media.url,
            title: {
              text: request.text.substring(0, 100), // Use first 100 chars as title
            },
          },
        ];
      }
    }

    // Publish the post
    const publishResponse = await fetch(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postData),
      }
    );

    if (!publishResponse.ok) {
      throw new Error(`LinkedIn API error: ${publishResponse.status}`);
    }

    const data = await publishResponse.json();
    return { id: data.id };
  } catch (error) {
    console.error('Error publishing to LinkedIn:', error);
    throw error;
  }
}
