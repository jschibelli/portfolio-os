// Stripe Integration Adapter
// Docs: https://stripe.com/docs/api
// Server-only - uses Stripe secret key

export interface StripeRevenueSnapshot {
  total: number;
  currency: string;
}

export interface StripePayout {
  id: string;
  amount: number;
  arrival_date: string;
  status: string;
}

export interface StripeCharge {
  id: string;
  amount: number;
  created: string;
  status: string;
  description?: string;
}

// Get Stripe secret key from environment
function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY environment variable not set');
  }
  return key;
}

export async function revenueSnapshot({ days }: { days: number }): Promise<StripeRevenueSnapshot> {
  try {
    const key = getStripeSecretKey();
    const now = Math.floor(Date.now() / 1000);
    const startTime = now - (days * 24 * 60 * 60);
    
    const response = await fetch(
      `https://api.stripe.com/v1/charges?created[gte]=${startTime}&created[lte]=${now}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }

    const data = await response.json();
    const charges = data.data || [];

    // Calculate total revenue from successful charges
    const total = charges
      .filter((charge: any) => charge.status === 'succeeded')
      .reduce((sum: number, charge: any) => sum + charge.amount, 0);

    return {
      total: total / 100, // Convert from cents
      currency: charges[0]?.currency || 'usd',
    };
  } catch (error) {
    console.error('Error getting revenue snapshot:', error);
    throw error;
  }
}

export async function recentPayouts({ limit = 10 }: { limit?: number } = {}): Promise<StripePayout[]> {
  try {
    const key = getStripeSecretKey();
    
    const response = await fetch(
      `https://api.stripe.com/v1/payouts?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }

    const data = await response.json();
    const payouts = data.data || [];

    return payouts.map((payout: any) => ({
      id: payout.id,
      amount: payout.amount / 100, // Convert from cents
      arrival_date: new Date(payout.arrival_date * 1000).toISOString(),
      status: payout.status,
    }));
  } catch (error) {
    console.error('Error getting recent payouts:', error);
    throw error;
  }
}

export async function recentCharges({ limit = 10 }: { limit?: number } = {}): Promise<StripeCharge[]> {
  try {
    const key = getStripeSecretKey();
    
    const response = await fetch(
      `https://api.stripe.com/v1/charges?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }

    const data = await response.json();
    const charges = data.data || [];

    return charges.map((charge: any) => ({
      id: charge.id,
      amount: charge.amount / 100, // Convert from cents
      created: new Date(charge.created * 1000).toISOString(),
      status: charge.status,
      description: charge.description,
    }));
  } catch (error) {
    console.error('Error getting recent charges:', error);
    throw error;
  }
}
