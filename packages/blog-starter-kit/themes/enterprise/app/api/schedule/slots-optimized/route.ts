export const runtime = 'nodejs';

import { getFreeSlots, getCacheStats } from '@/lib/google/calendar';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define proper response interfaces for type safety
interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
}

interface SlotsResponse {
  slots: TimeSlot[];
  performance: {
    totalTime: string;
    slotCount: number;
  };
  cacheStats?: CacheStats;
}

interface ErrorResponse {
  error: string;
  performance: {
    totalTime: string;
  };
}

const Body = z.object({
	durationMinutes: z.number().int().min(10).max(180),
	// Window to search in (ISO, local time respected via timeZone).
	startISO: z.string().min(10),
	endISO: z.string().min(10),
	timeZone: z.string().min(3),
	dayStartHour: z.number().int().min(0).max(23).optional(),
	dayEndHour: z.number().int().min(0).max(23).optional(),
	maxCandidates: z.number().int().min(1).max(100).optional(),
	// Performance options
	useCache: z.boolean().optional().default(true),
	includeStats: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest): Promise<NextResponse<SlotsResponse | ErrorResponse>> {
	const startTime = Date.now();
	const requestId = crypto.randomUUID();
	
	try {
		const json = await req.json();
		const input = Body.parse(json);

		// Enhanced logging with structured data and request tracking
		console.log('🚀 [OPTIMIZED] Processing slots request:', {
			requestId,
			durationMinutes: input.durationMinutes,
			timeRange: `${input.startISO} to ${input.endISO}`,
			timeZone: input.timeZone,
			useCache: input.useCache,
			timestamp: new Date().toISOString()
		});

		const slots = await getFreeSlots({
			timeMinISO: input.startISO,
			timeMaxISO: input.endISO,
			timeZone: input.timeZone,
			durationMinutes: input.durationMinutes,
			dayStartHour: input.dayStartHour ?? 9,
			dayEndHour: input.dayEndHour ?? 18,
			maxCandidates: input.maxCandidates ?? 30,
		});

		const totalTime = Date.now() - startTime;
		
		const response: SlotsResponse = { 
			slots,
			performance: {
				totalTime: `${totalTime}ms`,
				slotCount: slots.length
			}
		};

		// Include cache stats if requested
		if (input.includeStats) {
			response.cacheStats = getCacheStats();
		}

		console.log(`✅ [OPTIMIZED] Request ${requestId} completed in ${totalTime}ms`);

		return NextResponse.json(response);
	} catch (e: any) {
		const totalTime = Date.now() - startTime;
		const errorResponse: ErrorResponse = {
			error: e?.issues ? JSON.stringify(e.issues) : e?.message || 'Unknown error',
			performance: {
				totalTime: `${totalTime}ms`
			}
		};
		
		console.error(`❌ [OPTIMIZED] Request ${requestId} failed after ${totalTime}ms:`, errorResponse.error);
		
		return NextResponse.json(errorResponse, { status: 400 });
	}
}
