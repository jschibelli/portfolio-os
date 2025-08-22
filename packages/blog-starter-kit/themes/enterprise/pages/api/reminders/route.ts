import { NextRequest } from 'next/server';

let prisma: any = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch {}

export async function GET(_req: NextRequest) {
  if (!prisma) {
    return new Response(JSON.stringify({ ok: false, error: 'Prisma unavailable' }), { status: 500 });
  }

  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in10m = new Date(now.getTime() + 10 * 60 * 1000);

    // Find bookings needing reminders (simple heuristics)
    const upcoming = await prisma.booking.findMany({
      where: {
        startTime: { gte: now },
      },
      orderBy: { startTime: 'asc' },
      take: 100,
    });

    let sent24 = 0;
    let sent10 = 0;

    for (const b of upcoming) {
      // 24h reminder window (within ~1h of 24h before)
      const before24 = new Date(b.startTime.getTime() - 24 * 60 * 60 * 1000);
      if (!b.reminder24hSent && Math.abs(now.getTime() - before24.getTime()) < 60 * 60 * 1000) {
        // TODO: send email via Resend
        await prisma.booking.update({ where: { id: b.id }, data: { reminder24hSent: true } });
        sent24++;
      }

      // 10m reminder window (within ~5m of 10m before)
      const before10 = new Date(b.startTime.getTime() - 10 * 60 * 1000);
      if (!b.reminder10mSent && Math.abs(now.getTime() - before10.getTime()) < 5 * 60 * 1000) {
        await prisma.booking.update({ where: { id: b.id }, data: { reminder10mSent: true } });
        sent10++;
      }
    }

    return new Response(JSON.stringify({ ok: true, sent24, sent10 }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'error' }), { status: 500 });
  }
}


