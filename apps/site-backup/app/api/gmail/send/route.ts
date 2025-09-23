import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/integrations/gmail';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, bodyHtml, bodyText, inReplyTo } = await request.json();
    
    if (!to || !subject || (!bodyHtml && !bodyText)) {
      return NextResponse.json(
        { error: 'To, subject, and body are required' },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to,
      subject,
      bodyHtml,
      bodyText,
      inReplyTo,
    });
    
    return NextResponse.json({ id: result.id });
  } catch (error: any) {
    console.error('Gmail send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
