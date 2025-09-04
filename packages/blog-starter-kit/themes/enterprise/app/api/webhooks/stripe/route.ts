import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    let activityData: any = {};

    switch (event.type) {
      case 'payout.paid':
        activityData = {
          kind: 'PAYOUT_PAID',
          channel: 'stripe',
          externalId: event.data.object.id,
          meta: {
            amount: event.data.object.amount / 100,
            currency: event.data.object.currency,
            arrivalDate: new Date(event.data.object.arrival_date * 1000).toISOString(),
          },
        };
        break;

      case 'charge.succeeded':
        activityData = {
          kind: 'CHARGE_SUCCEEDED',
          channel: 'stripe',
          externalId: event.data.object.id,
          meta: {
            amount: event.data.object.amount / 100,
            currency: event.data.object.currency,
            description: event.data.object.description,
            customer: event.data.object.customer,
          },
        };
        break;

      case 'charge.refunded':
        activityData = {
          kind: 'CHARGE_REFUNDED',
          channel: 'stripe',
          externalId: event.data.object.id,
          meta: {
            amount: event.data.object.amount / 100,
            currency: event.data.object.currency,
            refundAmount: event.data.object.amount_refunded / 100,
            reason: event.data.object.refunds?.data?.[0]?.reason,
          },
        };
        break;

      case 'invoice.payment_succeeded':
        activityData = {
          kind: 'INVOICE_PAID',
          channel: 'stripe',
          externalId: event.data.object.id,
          meta: {
            amount: event.data.object.amount_paid / 100,
            currency: event.data.object.currency,
            customer: event.data.object.customer,
            subscription: event.data.object.subscription,
          },
        };
        break;

      default:
        // Log unhandled events but don't create activities
        console.log(`Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true });
    }

    // Create activity record
    if (activityData.kind) {
      await prisma.activity.create({
        data: activityData,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
