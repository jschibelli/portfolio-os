import { DateTime, Interval } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { getCalendar, getOAuth2Client } from './auth';

type Slot = { startISO: string; endISO: string };

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

export async function getBusyWindows(opts: {
	timeMinISO: string;
	timeMaxISO: string;
	timeZone: string;
}) {
	const calendar = getCalendar();
	const res = await calendar.freebusy.query({
		requestBody: {
			timeMin: opts.timeMinISO,
			timeMax: opts.timeMaxISO,
			timeZone: opts.timeZone,
			items: [{ id: CALENDAR_ID }],
		},
	});

	const cal = res.data.calendars?.[CALENDAR_ID];
	const busy = (cal?.busy ?? []).map((b) => ({
		start: b.start!,
		end: b.end!,
	}));
	return busy;
}

// Compute free slots from busy windows.
export async function getFreeSlots(opts: {
	timeMinISO: string; // inclusive window start
	timeMaxISO: string; // exclusive window end
	timeZone: string;
	durationMinutes: number;
	minBufferMinutes?: number; // optional buffer before/after events
	dayStartHour?: number; // e.g., 9 local
	dayEndHour?: number; // e.g., 18 local
	maxCandidates?: number; // cap list
}): Promise<Slot[]> {
	const {
		timeMinISO,
		timeMaxISO,
		timeZone,
		durationMinutes,
		minBufferMinutes = 5,
		dayStartHour = 9,
		dayEndHour = 18,
		maxCandidates = 30,
	} = opts;

	const busy = await getBusyWindows({ timeMinISO, timeMaxISO, timeZone });
	const tz = timeZone;

	const windowStart = DateTime.fromISO(timeMinISO, { zone: tz });
	const windowEnd = DateTime.fromISO(timeMaxISO, { zone: tz });

	// Merge/normalize busy intervals.
	const busyIntervals = busy
		.map((b) =>
			Interval.fromDateTimes(
				DateTime.fromISO(b.start, { zone: tz }),
				DateTime.fromISO(b.end, { zone: tz }),
			),
		)
		.filter((i) => i.isValid)
		.sort((a, b) => a.start!.toMillis() - b.start!.toMillis());

	const merged: Interval[] = [];
	for (const i of busyIntervals) {
		const last = merged[merged.length - 1];
		if (!last) merged.push(i);
		else if (last.overlaps(i) || last.engulfs(i) || i.engulfs(last) || last.abutsStart(i)) {
			merged[merged.length - 1] = Interval.fromDateTimes(
				DateTime.min(last.start!, i.start!),
				DateTime.max(last.end!, i.end!),
			);
		} else {
			merged.push(i);
		}
	}

	// Build candidate free intervals within workday bounds.
	const dayIntervals: Interval[] = [];
	for (let d = windowStart.startOf('day'); d < windowEnd; d = d.plus({ days: 1 })) {
		const start = d.set({ hour: dayStartHour, minute: 0 });
		const end = d.set({ hour: dayEndHour, minute: 0 });
		const dayI = Interval.fromDateTimes(
			start < windowStart ? windowStart : start,
			end > windowEnd ? windowEnd : end,
		);
		if (dayI.isValid) dayIntervals.push(dayI);
	}

	// Subtract busy from each day interval.
	const free: Interval[] = [];
	for (const day of dayIntervals) {
		let cursor: DateTime = day.start!;
		for (const b of merged) {
			if (b.end! <= day.start! || b.start! >= day.end!) continue;
			const overlap = Interval.fromDateTimes(
				DateTime.max(b.start!, day.start!),
				DateTime.min(b.end!, day.end!),
			);
			if (overlap.isValid) {
				// segment before overlap
				if (cursor < overlap.start!) {
					free.push(Interval.fromDateTimes(cursor, overlap.start!));
				}
				cursor = overlap.end!;
			}
		}
		if (cursor < day.end!) free.push(Interval.fromDateTimes(cursor, day.end!));
	}

	// Expand free intervals into concrete slots by duration, with buffers.
	const slots: Slot[] = [];
	const dur = { minutes: durationMinutes };
	for (const f of free) {
		let s = f.start!.plus({ minutes: minBufferMinutes });
		const latestStart = f.end!.minus(dur).minus({ minutes: minBufferMinutes });
		while (s <= latestStart) {
			// Round to 5-min grid for nicer UX
			const rounded = s.set({ minute: Math.floor(s.minute / 5) * 5, second: 0, millisecond: 0 });
			const e = rounded.plus(dur);
			if (Interval.fromDateTimes(rounded, e).isValid) {
				slots.push({ startISO: rounded.toISO(), endISO: e.toISO() });
			}
			s = s.plus({ minutes: 5 });
			if (slots.length >= maxCandidates) break;
		}
		if (slots.length >= maxCandidates) break;
	}
	return slots;
}

export async function createCalendarEventWithMeet(opts: {
	startISO: string;
	endISO: string;
	timeZone: string;
	summary: string;
	description?: string;
	attendeeEmail: string;
	attendeeName?: string;
	sendUpdates?: 'all' | 'externalOnly' | 'none';
}) {
	const {
		startISO,
		endISO,
		timeZone,
		summary,
		description,
		attendeeEmail,
		attendeeName,
		sendUpdates = 'all',
	} = opts;
	const oauth = getOAuth2Client();
	// Ensure fresh access token if we rely on REFRESH token.
	await oauth.getAccessToken();

	const calendar = getCalendar();

	const res = await calendar.events.insert({
		calendarId: CALENDAR_ID,
		conferenceDataVersion: 1,
		sendUpdates,
		requestBody: {
			summary,
			description,
			location: 'Google Meet',
			start: { dateTime: startISO, timeZone },
			end: { dateTime: endISO, timeZone },
			attendees: [{ email: attendeeEmail, displayName: attendeeName }],
			conferenceData: {
				createRequest: {
					requestId: uuidv4(),
					conferenceSolutionKey: { type: 'hangoutsMeet' },
				},
			},
		},
	});

	// Preferred: conferenceData entryPoint; fallback to hangoutLink
	const entryPoints = res.data.conferenceData?.entryPoints || [];
	const video = entryPoints.find((e) => e.entryPointType === 'video');
	const meetUrl = video?.uri || res.data.hangoutLink || '';

	return {
		eventId: res.data.id!,
		htmlLink: res.data.htmlLink!,
		meetUrl,
	};
}
