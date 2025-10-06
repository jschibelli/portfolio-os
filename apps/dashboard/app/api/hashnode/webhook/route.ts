/**
 * Hashnode Webhook Handler
 * POST /api/hashnode/webhook
 * Handles webhook events from Hashnode
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { WebhookPayload } from '@mindware-blog/hashnode';

const prisma = new PrismaClient();

/**
 * Verifies webhook signature (if Hashnode provides one)
 */
function verifyWebhookSignature(request: NextRequest, payload: string): boolean {
  const signature = request.headers.get('x-hashnode-signature');
  const secret = process.env.HASHNODE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    // If no signature/secret configured, skip verification
    // In production, you should always verify webhooks
    return true;
  }

  // Implement signature verification based on Hashnode's webhook documentation
  // This is a placeholder - adjust based on actual Hashnode webhook signature method
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    
    // Verify webhook signature
    if (!verifyWebhookSignature(request, rawBody)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload: WebhookPayload = JSON.parse(rawBody);

    console.log('[Hashnode Webhook] Received event:', payload.event);

    // Handle different webhook events
    switch (payload.event) {
      case 'POST_PUBLISHED':
        await handlePostPublished(payload);
        break;

      case 'POST_UPDATED':
        await handlePostUpdated(payload);
        break;

      case 'POST_DELETED':
        await handlePostDeleted(payload);
        break;

      default:
        console.warn('[Hashnode Webhook] Unknown event type:', payload.event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Hashnode Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function handlePostPublished(payload: WebhookPayload): Promise<void> {
  const { post } = payload;

  // Find article by Hashnode ID
  const article = await prisma.article.findFirst({
    where: { hashnodeId: post.id },
  });

  if (article) {
    // Update article status
    await prisma.article.update({
      where: { id: article.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(payload.timestamp),
        updatedAt: new Date(),
      },
    });

    console.log('[Hashnode Webhook] Article published:', article.id);
  }
}

async function handlePostUpdated(payload: WebhookPayload): Promise<void> {
  const { post } = payload;

  // Find article by Hashnode ID
  const article = await prisma.article.findFirst({
    where: { hashnodeId: post.id },
  });

  if (article) {
    // Update article timestamp
    await prisma.article.update({
      where: { id: article.id },
      data: {
        updatedAt: new Date(payload.timestamp),
      },
    });

    console.log('[Hashnode Webhook] Article updated:', article.id);
  }
}

async function handlePostDeleted(payload: WebhookPayload): Promise<void> {
  const { post } = payload;

  // Find article by Hashnode ID
  const article = await prisma.article.findFirst({
    where: { hashnodeId: post.id },
  });

  if (article) {
    // Remove Hashnode ID (don't delete local article)
    await prisma.article.update({
      where: { id: article.id },
      data: {
        hashnodeId: null,
        updatedAt: new Date(),
      },
    });

    console.log('[Hashnode Webhook] Article deleted from Hashnode:', article.id);
  }
}

