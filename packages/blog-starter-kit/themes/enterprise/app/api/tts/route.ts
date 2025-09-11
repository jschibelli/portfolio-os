import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

// Simple in-memory rate limiting (for production, consider Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

// Input validation schema for enhanced security
const TTSRequestSchema = z.object({
  text: z.string().min(1).max(4000), // OpenAI TTS character limit
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).default('alloy')
});

// Initialize OpenAI client with enhanced configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
});

/**
 * POST /api/tts
 * 
 * Generates speech from text using OpenAI's Text-to-Speech API with enhanced security and rate limiting.
 * 
 * @param request - NextRequest containing text and voice parameters
 * @returns Promise<NextResponse> - Audio file or error response
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/tts', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     text: 'Hello, world!',
 *     voice: 'alloy'
 *   })
 * });
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting implementation
    const clientIP = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    const clientData = rateLimitMap.get(clientIP);
    
    if (clientData) {
      if (now < clientData.resetTime) {
        if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429, headers: { 'Retry-After': '60' } }
          );
        }
        clientData.count++;
      } else {
        rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Enhanced API key validation with better error messaging
    if (!process.env.OPENAI_API_KEY) {
      console.error('🔊 OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please contact support.' },
        { status: 503 }
      );
    }

    // Validate and parse request with enhanced error handling
    const body = await request.json();
    const { text, voice } = TTSRequestSchema.parse(body);

    // Additional security: Check for potentially malicious content
    if (text.length > 4000) {
      return NextResponse.json(
        { error: 'Text exceeds maximum length limit' },
        { status: 400 }
      );
    }


    // Generate speech using OpenAI TTS with enhanced error handling
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as any,
      input: text,
      response_format: 'mp3',
    });

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Return the audio file with enhanced security headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://johnschibelli.dev' : '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    });

  } catch (error) {
    console.error('🔊 TTS API Error:', error);
    
    // Enhanced error handling with specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        );
      }
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'OpenAI API rate limit exceeded' },
          { status: 429 }
        );
      }
      if (error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          { error: 'Service quota exceeded' },
          { status: 402 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests with enhanced security
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://johnschibelli.dev' : '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate speech.' },
    { status: 405 }
  );
}
