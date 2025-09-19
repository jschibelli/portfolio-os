import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publishUGC } from '@/lib/integrations/linkedin';
import { publishPagePost } from '@/lib/integrations/facebook';
import { publishThread } from '@/lib/integrations/threads';
import { calculateBackoffDelay } from '@/lib/queue/backoff';

export async function GET(request: NextRequest) {
  return await runJobs(request);
}

export async function POST(request: NextRequest) {
  return await runJobs(request);
}

async function runJobs(request: NextRequest) {
  try {
    // Verify cron secret
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find jobs that are due to run
    const dueJobs = await prisma.job.findMany({
      where: {
        runAt: { lte: new Date() },
        status: 'QUEUED',
      },
      take: 10, // Process max 10 jobs at a time
      orderBy: { runAt: 'asc' },
    });

    if (dueJobs.length === 0) {
      return NextResponse.json({ message: 'No jobs to process' });
    }

    const results = [];

    for (const job of dueJobs) {
      try {
        // Mark job as running
        await prisma.job.update({
          where: { id: job.id },
          data: { status: 'RUNNING' },
        });

        const payload = job.payloadJson as any;
        let success = false;

        if (job.type === 'social') {
          // Process social media job
          const { channels, body, media } = payload;
          
          for (const channel of channels) {
            try {
              let result;
              
              switch (channel) {
                case 'linkedin':
                  result = await publishUGC({ text: body, media });
                  break;
                case 'facebook':
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

              // Log activity
              await prisma.activity.create({
                data: {
                  kind: 'POST_PUBLISHED',
                  channel,
                  externalId: result.id,
                  meta: { body, media, scheduled: true },
                },
              });

              success = true;
            } catch (error: any) {
              console.error(`Error publishing to ${channel}:`, error);
            }
          }
        }

        if (success) {
          // Mark job as successful
          await prisma.job.update({
            where: { id: job.id },
            data: { status: 'SUCCESS' },
          });
          
          results.push({ jobId: job.id, status: 'SUCCESS' });
        } else {
          throw new Error('All channels failed to publish');
        }

      } catch (error: any) {
        console.error(`Error processing job ${job.id}:`, error);
        
        const attempts = job.attempts + 1;
        const maxAttempts = 5;
        
        if (attempts >= maxAttempts) {
          // Mark job as failed
          await prisma.job.update({
            where: { id: job.id },
            data: { 
              status: 'FAILED',
              attempts,
              lastError: error.message,
            },
          });
          
          results.push({ jobId: job.id, status: 'FAILED', error: error.message });
        } else {
          // Reschedule job with backoff
          const backoffDelay = calculateBackoffDelay(attempts);
          const newRunAt = new Date(Date.now() + backoffDelay);
          
          await prisma.job.update({
            where: { id: job.id },
            data: { 
              status: 'QUEUED',
              attempts,
              lastError: error.message,
              runAt: newRunAt,
            },
          });
          
          results.push({ jobId: job.id, status: 'RESCHEDULED', nextRun: newRunAt });
        }
      }
    }

    return NextResponse.json({
      message: `Processed ${dueJobs.length} jobs`,
      results,
    });

  } catch (error: any) {
    console.error('Cron job executor error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process jobs' },
      { status: 500 }
    );
  }
}
