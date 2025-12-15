import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

/**
 * Hashnode Webhook endpoint for automatic cache revalidation
 * 
 * This endpoint receives webhooks from Hashnode when posts are published/updated/deleted
 * and automatically revalidates the blog cache so new posts appear immediately.
 * 
 * To set up:
 * 1. Go to your Hashnode publication settings
 * 2. Navigate to Webhooks section
 * 3. Add webhook URL: https://yourdomain.com/api/webhooks/hashnode
 * 4. Set HASHNODE_WEBHOOK_SECRET in your environment variables
 * 5. Select events: POST_PUBLISHED, POST_UPDATED, POST_DELETED
 * 
 * Required environment variables:
 *   HASHNODE_WEBHOOK_SECRET - Secret key for webhook signature verification (optional but recommended)
 */

interface HashnodeWebhookPayload {
  event: 'POST_PUBLISHED' | 'POST_UPDATED' | 'POST_DELETED';
  data: {
    postId: string;
    slug: string;
    title: string;
    publishedAt?: string;
  };
}

/**
 * Verify webhook signature from Hashnode
 */
function verifyWebhookSignature(
  request: NextRequest,
  payload: string
): boolean {
  const secret = process.env.HASHNODE_WEBHOOK_SECRET;
  
  // If no secret is configured, skip verification (not recommended for production)
  if (!secret) {
    console.warn('[Hashnode Webhook] HASHNODE_WEBHOOK_SECRET not set, skipping signature verification');
    return true;
  }

  const signature = request.headers.get('x-hashnode-signature');
  if (!signature) {
    console.warn('[Hashnode Webhook] Missing signature header');
    return false;
  }

  // Hashnode uses HMAC SHA256
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Compare signatures in constant time to prevent timing attacks
  // timingSafeEqual requires buffers to be the same length
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    
    // Verify webhook signature if secret is configured
    if (!verifyWebhookSignature(request, rawBody)) {
      console.error('[Hashnode Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload: HashnodeWebhookPayload = JSON.parse(rawBody);

    console.log(`[Hashnode Webhook] Received event: ${payload.event} for post: ${payload.data.slug}`);

    // Revalidate paths based on the event
    const pathsToRevalidate: string[] = ['/blog'];
    
    // If we have a slug, also revalidate the specific post page
    if (payload.data.slug) {
      pathsToRevalidate.push(`/blog/${payload.data.slug}`);
    }

    // Revalidate all paths
    const revalidatedPaths: string[] = [];
    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
        console.log(`[Hashnode Webhook] Revalidated: ${path}`);
      } catch (error) {
        console.error(`[Hashnode Webhook] Error revalidating ${path}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      event: payload.event,
      revalidatedPaths,
      message: `Successfully processed ${payload.event} event`,
    });
  } catch (error) {
    console.error('[Hashnode Webhook] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Support GET for webhook testing/verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Hashnode webhook endpoint is active',
    usage: 'Configure this URL in your Hashnode publication webhook settings',
    events: ['POST_PUBLISHED', 'POST_UPDATED', 'POST_DELETED'],
    note: 'Set HASHNODE_WEBHOOK_SECRET environment variable for signature verification',
  });
}

