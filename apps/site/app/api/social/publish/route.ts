import { NextRequest, NextResponse } from 'next/server';
import { publishUGC } from '@/lib/integrations/linkedin';
import { publishPagePost } from '@/lib/integrations/facebook';
import { publishThread } from '@/lib/integrations/threads';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { channels, body, media, scheduledAt } = await request.json();

    if (!channels || !Array.isArray(channels) || channels.length === 0 || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: channels (array) and body' },
        { status: 400 }
      );
    }

    // If scheduled for future, create a job
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      const job = await prisma.job.create({
        data: {
          type: 'social',
          payloadJson: { channels, body, media, scheduledAt },
          runAt: new Date(scheduledAt),
          status: 'QUEUED',
        },
      });

      return NextResponse.json({ 
        success: true, 
        jobId: job.id, 
        message: 'Content scheduled for publication' 
      });
    }

    // Publish immediately
    const results = [];
    const errors = [];

    for (const channel of channels) {
      try {
        let result;
        
        switch (channel) {
          case 'linkedin':
            result = await publishUGC({ text: body, media });
            break;
          case 'facebook':
            // Note: This requires a pageId which should be passed in the request
            // For now, we'll skip Facebook if no pageId is provided
            if (media?.url) {
              result = await publishPagePost({ 
                pageId: process.env.FACEBOOK_PAGE_ID || '', 
                message: body, 
                link: media.url 
              });
            } else {
              result = await publishPagePost({ 
                pageId: process.env.FACEBOOK_PAGE_ID || '', 
                message: body 
              });
            }
            break;
          case 'threads':
            result = await publishThread({ text: body, mediaUrl: media?.url });
            break;
          default:
            throw new Error(`Unsupported channel: ${channel}`);
        }

        results.push({ channel, id: result.id });

        // Log activity
        await prisma.activity.create({
          data: {
            kind: 'POST_PUBLISHED',
            channel,
            externalId: result.id,
            meta: { body, media },
          },
        });

      } catch (error: any) {
        console.error(`Error publishing to ${channel}:`, error);
        errors.push({ channel, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error: any) {
    console.error('Social publish error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish content' },
      { status: 500 }
    );
  }
}
