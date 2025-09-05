export const runtime = 'nodejs';

import { createCalendarEventWithMeet, getBusyWindows } from '@/lib/google/calendar';
import { DateTime, Interval } from 'luxon';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({
	startISO: z.string().min(10),
	durationMinutes: z.number().int().min(10).max(180),
	timeZone: z.string().min(3),
	attendeeEmail: z.string().email(),
	attendeeName: z.string().min(1).optional(),
	summary: z.string().min(3).max(120),
	description: z.string().max(5000).optional(),
	sendUpdates: z.enum(['all', 'externalOnly', 'none']).optional(),
});

export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const input = Body.parse(json);

		const start = DateTime.fromISO(input.startISO, { zone: input.timeZone });
		const end = start.plus({ minutes: input.durationMinutes });
		const startISO = start.toISO()!;
		const endISO = end.toISO()!;

		// Final race check against Free/Busy.
		const busy = await getBusyWindows({
			timeMinISO: start.minus({ minutes: 1 }).toISO()!,
			timeMaxISO: end.plus({ minutes: 1 }).toISO()!,
			timeZone: input.timeZone,
		});

		const conflicts = busy.some((b: any) => {
			const i = Interval.fromDateTimes(
				DateTime.fromISO(b.start, { zone: input.timeZone }),
				DateTime.fromISO(b.end, { zone: input.timeZone }),
			);
			return i.overlaps(Interval.fromDateTimes(start, end));
		});

		if (conflicts) {
			return NextResponse.json(
				{ error: 'Slot just became unavailable. Pick another time.' },
				{ status: 409 },
			);
		}

		const created = await createCalendarEventWithMeet({
			startISO,
			endISO,
			timeZone: input.timeZone,
			summary: input.summary,
			description: input.description,
			attendeeEmail: input.attendeeEmail,
			attendeeName: input.attendeeName,
			sendUpdates: input.sendUpdates ?? 'all',
		});

		return NextResponse.json({
			ok: true,
			eventId: created.eventId,
			htmlLink: created.htmlLink,
			meetUrl: created.meetUrl,
			startISO,
			endISO,
		});
	} catch (e: any) {
		const msg = e?.issues ? JSON.stringify(e.issues) : e?.message || 'Unknown error';
		return NextResponse.json({ error: msg }, { status: 400 });
	}
}
