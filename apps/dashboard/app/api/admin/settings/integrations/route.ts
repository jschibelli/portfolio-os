import { NextRequest, NextResponse } from "next/server";

// Temporarily disabled - Integration model not in schema
export async function GET(request: NextRequest) {
  return NextResponse.json([
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      type: 'analytics',
      status: 'connected',
      config: {
        trackingId: '',
        measurementId: ''
      },
      lastSync: null
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      type: 'email',
      status: 'disconnected',
      config: {},
      lastSync: null
    },
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'payment',
      status: 'disconnected',
      config: {},
      lastSync: null
    }
  ]);
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Integrations feature not implemented yet" },
    { status: 501 }
  );
}