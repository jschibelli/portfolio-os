import { NextRequest } from 'next/server';

let prisma: any = null;
let resend: any = null;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch {}

try {
  const { Resend } = require('resend');
  resend = new Resend(process.env.RESEND_API_KEY);
} catch {}

export async function GET(_req: NextRequest) {
  if (!prisma) {
    return new Response(JSON.stringify({ ok: false, error: 'Prisma unavailable' }), { status: 500 });
  }

  try {
    const now = new Date();

    const needsFollowup = await prisma.booking.findMany({
      where: {
        endTime: { lte: now },
        followupSent: false,
      },
      orderBy: { endTime: 'asc' },
      take: 100,
    });

    let sent = 0;

    for (const b of needsFollowup) {
      // Attempt to send a follow-up email (if configured)
      if (resend && process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: 'John Schibelli <john@mindware.dev>',
            to: [b.email],
            subject: 'Thanks for meeting with John',
            html: `
              <h2>Thanks for meeting!</h2>
              <p>Hi ${b.name},</p>
              <p>Thanks for your time today. Would you like notes, a recording, or to book a follow-up?</p>
              <p>
                <a href="mailto:jschibelli@gmail.com?subject=Meeting%20Notes%20Request">Request notes</a> ·
                <a href="mailto:jschibelli@gmail.com?subject=Share%20Recording">Request recording</a> ·
                <a href="mailto:jschibelli@gmail.com?subject=Book%20Follow-up">Book a follow-up</a>
              </p>
            `,
          });
        } catch (e) {
          // Log and continue; do not fail the batch
          console.error('Follow-up email failed for booking', b.id, e);
        }
      }

      await prisma.booking.update({ where: { id: b.id }, data: { followupSent: true } });
      sent++;
    }

    return new Response(JSON.stringify({ ok: true, sent }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || 'error' }), { status: 500 });
  }
}


