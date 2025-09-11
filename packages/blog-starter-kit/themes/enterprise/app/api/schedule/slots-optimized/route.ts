export const runtime = 'nodejs';

import { getFreeSlots, getCacheStats } from '@/lib/google/calendar';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

export async function POST(req: NextRequest) {
	const startTime = Date.now();
	
	try {
		const json = await req.json();
		const input = Body.parse(json);

		console.log('🚀 [OPTIMIZED] Processing slots request:', {
			durationMinutes: input.durationMinutes,
			timeRange: `${input.startISO} to ${input.endISO}`,
			timeZone: input.timeZone,
			useCache: input.useCache
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
		
		const response: any = { 
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

		console.log(`✅ [OPTIMIZED] Request completed in ${totalTime}ms`);

		return NextResponse.json(response);
	} catch (e: any) {
		const totalTime = Date.now() - startTime;
		const msg = e?.issues ? JSON.stringify(e.issues) : e?.message || 'Unknown error';
		
		console.error(`❌ [OPTIMIZED] Request failed after ${totalTime}ms:`, msg);
		
		return NextResponse.json({ 
			error: msg,
			performance: {
				totalTime: `${totalTime}ms`
			}
		}, { status: 400 });
	}
}
