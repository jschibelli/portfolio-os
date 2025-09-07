import { NextRequest, NextResponse } from 'next/server';
import { revenueSnapshot, recentPayouts, recentCharges } from '@/lib/integrations/stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const payoutLimit = parseInt(searchParams.get('payoutLimit') || '5');
    const chargeLimit = parseInt(searchParams.get('chargeLimit') || '10');

    // Fetch all Stripe data in parallel
    const [revenueData, payoutsData, chargesData] = await Promise.all([
      revenueSnapshot({ days }),
      recentPayouts({ limit: payoutLimit }),
      recentCharges({ limit: chargeLimit }),
    ]);

    return NextResponse.json({
      revenue: revenueData,
      payouts: payoutsData,
      charges: chargesData,
    });
  } catch (error: any) {
    console.error('Stripe finance error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Stripe data' },
      { status: 500 }
    );
  }
}
