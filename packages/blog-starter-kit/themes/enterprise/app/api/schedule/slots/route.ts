export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getFreeSlots } from '@/lib/google/calendar';

const Body = z.object({
	durationMinutes: z.number().int().min(10).max(180),
	// Window to search in (ISO, local time respected via timeZone).
	startISO: z.string().min(10),
	endISO: z.string().min(10),
	timeZone: z.string().min(3),
	dayStartHour: z.number().int().min(0).max(23).optional(),
	dayEndHour: z.number().int().min(0).max(23).optional(),
	maxCandidates: z.number().int().min(1).max(100).optional(),
});

export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const input = Body.parse(json);

		const slots = await getFreeSlots({
			timeMinISO: input.startISO,
			timeMaxISO: input.endISO,
			timeZone: input.timeZone,
			durationMinutes: input.durationMinutes,
			dayStartHour: input.dayStartHour ?? 9,
			dayEndHour: input.dayEndHour ?? 18,
			maxCandidates: input.maxCandidates ?? 30,
		});

		return NextResponse.json({ slots });
	} catch (e: any) {
		const msg = e?.issues ? JSON.stringify(e.issues) : e?.message || 'Unknown error';
		return NextResponse.json({ error: msg }, { status: 400 });
	}
}


