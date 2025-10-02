/**
 * Hashnode Webhook Handler
 * Handles incoming webhooks from Hashnode for bidirectional sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { BidirectionalSync } from '@/lib/sync/bidirectional-sync';
import { WebhookPayload } from '@mindware-blog/hashnode/types';
import crypto from 'crypto';

// Initialize sync system
const syncSystem = new BidirectionalSync({
  enabled: process.env.HASHNODE_SYNC_ENABLED === 'true',
  webhookSecret: process.env.HASHNODE_WEBHOOK_SECRET || '',
  retryAttempts: 3,
  retryDelay: 1000,
  conflictResolution: 'newest',
});

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Received Hashnode webhook');

    // Get request body
    const body = await request.text();
    const signature = request.headers.get('x-hashnode-signature') || '';

    // Parse webhook payload
    let payload: WebhookPayload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      console.error('❌ Invalid JSON payload:', error);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Initialize sync system if not already done
    if (!syncSystem.getStatus().isRunning) {
      await syncSystem.initialize();
    }

    // Process webhook
    await syncSystem.handleWebhook(payload, signature);

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  try {
    const status = syncSystem.getStatus();
    return NextResponse.json({
      status: 'healthy',
      syncEnabled: process.env.HASHNODE_SYNC_ENABLED === 'true',
      lastSync: status.lastSync,
      queueLength: syncSystem.getQueueLength(),
      isRunning: status.isRunning,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    );
  }
}

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(body: string, signature: string): boolean {
  const webhookSecret = process.env.HASHNODE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.warn('⚠️  HASHNODE_WEBHOOK_SECRET not configured');
    return true; // Allow in development
  }

  if (!signature) {
    return false;
  }

  // Extract signature from header (format: "sha256=<hash>")
  const expectedSignature = signature.replace('sha256=', '');
  
  // Calculate HMAC signature
  const calculatedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body, 'utf8')
    .digest('hex');

  // Compare signatures
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(calculatedSignature, 'hex')
  );
}
