import { DateTime, Interval } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { getCalendar, getAuth } from './auth';

// Simple in-memory cache for calendar data
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds (5 minutes for busy windows, 1 minute for free slots)
const CACHE_TTL = {
	BUSY_WINDOWS: 5 * 60 * 1000, // 5 minutes
	FREE_SLOTS: 1 * 60 * 1000,   // 1 minute
};

// Generate cache key for requests
function getCacheKey(type: string, params: Record<string, any>): string {
	return `${type}:${JSON.stringify(params)}`;
}

// Get cached data if still valid
function getCachedData(key: string): any | null {
	const cached = cache.get(key);
	if (!cached) return null;
	
	if (Date.now() - cached.timestamp > cached.ttl) {
		cache.delete(key);
		return null;
	}
	
	return cached.data;
}

// Set cache data
function setCachedData(key: string, data: any, ttl: number): void {
	cache.set(key, {
		data,
		timestamp: Date.now(),
		ttl
	});
}

// Optimize time range to reduce API load
function optimizeTimeRange(timeMinISO: string, timeMaxISO: string, timeZone: string): { timeMinISO: string; timeMaxISO: string } {
	const start = DateTime.fromISO(timeMinISO, { zone: timeZone });
	const end = DateTime.fromISO(timeMaxISO, { zone: timeZone });
	
	// Limit to maximum 30 days to prevent slow queries
	const maxRange = 30;
	const actualRange = end.diff(start, 'days').days;
	
	if (actualRange > maxRange) {
		console.log(`⚡ [DEBUG] Optimizing time range from ${actualRange.toFixed(1)} days to ${maxRange} days`);
		return {
			timeMinISO: start.toISO()!,
			timeMaxISO: start.plus({ days: maxRange }).toISO()!
		};
	}
	
	return { timeMinISO, timeMaxISO };
}

// Clear cache (useful for testing or when calendar data changes)
export function clearCalendarCache(): void {
	cache.clear();
	console.log('🗑️ [DEBUG] Calendar cache cleared');
}

// Get cache statistics
export function getCacheStats(): { size: number; entries: string[] } {
	return {
		size: cache.size,
		entries: Array.from(cache.keys())
	};
}

type Slot = { startISO: string; endISO: string };

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';


// Check if error is SSL/TLS related
function isSSLError(error: any): boolean {
	const message = error?.message || error?.toString() || '';
	return message.includes('ERR_OSSL_UNSUPPORTED') || 
		   message.includes('DECODER routines') ||
		   message.includes('SSL') ||
		   message.includes('TLS') ||
		   message.includes('certificate');
}

export async function getBusyWindows(opts: {
	timeMinISO: string;
	timeMaxISO: string;
	timeZone: string;
}) {
	// Optimize time range for better performance
	const optimizedRange = optimizeTimeRange(opts.timeMinISO, opts.timeMaxISO, opts.timeZone);
	
	// Check cache first
	const cacheKey = getCacheKey('busy_windows', { ...opts, ...optimizedRange });
	const cached = getCachedData(cacheKey);
	if (cached) {
		console.log('⚡ [DEBUG] Using cached busy windows data');
		return cached;
	}

	console.log('🔍 [DEBUG] Fetching busy windows from API:', {
		originalRange: { timeMinISO: opts.timeMinISO, timeMaxISO: opts.timeMaxISO },
		optimizedRange,
		timeZone: opts.timeZone,
		calendarId: CALENDAR_ID
	});

	const startTime = Date.now();

	try {
		const calendar = getCalendar();
		
		// Optimize query parameters for better performance
		const res = await calendar.freebusy.query({
			requestBody: {
				timeMin: optimizedRange.timeMinISO,
				timeMax: optimizedRange.timeMaxISO,
				timeZone: opts.timeZone,
				items: [{ id: CALENDAR_ID }],
				// Add query optimization parameters
				groupExpansionMax: 1, // Limit group expansion
				calendarExpansionMax: 1, // Limit calendar expansion
			},
		});

		const queryTime = Date.now() - startTime;
		console.log(`⚡ [DEBUG] API query completed in ${queryTime}ms`);

		const cal = res.data.calendars?.[CALENDAR_ID];
		const busy = (cal?.busy ?? []).map((b) => ({
			start: b.start!,
			end: b.end!,
		}));
		
		console.log('📊 [DEBUG] Found busy windows:', {
			count: busy.length,
			queryTime: `${queryTime}ms`
		});
		
		// Cache the result
		setCachedData(cacheKey, busy, CACHE_TTL.BUSY_WINDOWS);
		
		return busy;
	} catch (error) {
		const queryTime = Date.now() - startTime;
		console.error('❌ [DEBUG] Error fetching busy windows:', {
			error: error instanceof Error ? error.message : String(error),
			queryTime: `${queryTime}ms`,
			timeMinISO: opts.timeMinISO,
			timeMaxISO: opts.timeMaxISO,
			calendarId: CALENDAR_ID
		});
		
		if (isSSLError(error)) {
			console.warn('🔒 [DEBUG] SSL/TLS error detected');
		}
		
		// Always throw the error - no fallback to mock data
		throw new Error(`Failed to fetch busy windows: ${error instanceof Error ? error.message : String(error)}`);
	}
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

	// Check cache first for free slots
	const cacheKey = getCacheKey('free_slots', opts);
	const cached = getCachedData(cacheKey);
	if (cached) {
		console.log('⚡ [DEBUG] Using cached free slots data');
		return cached;
	}

	const startTime = Date.now();

	try {
		console.log('🎯 [DEBUG] Computing free slots with parameters:', {
			timeMinISO,
			timeMaxISO,
			timeZone,
			durationMinutes,
			dayStartHour,
			dayEndHour,
			maxCandidates
		});

		const busy = await getBusyWindows({ timeMinISO, timeMaxISO, timeZone });
		console.log('📋 [DEBUG] Received busy windows for free slot computation:', {
			busyCount: busy.length
		});
		
		const tz = timeZone;

		const windowStart = DateTime.fromISO(timeMinISO, { zone: tz });
		const windowEnd = DateTime.fromISO(timeMaxISO, { zone: tz });

		// Merge/normalize busy intervals.
		const busyIntervals = busy
			.map((b: { start: string; end: string }) =>
				Interval.fromDateTimes(
					DateTime.fromISO(b.start, { zone: tz }),
					DateTime.fromISO(b.end, { zone: tz }),
				),
			)
			.filter((i: Interval) => i.isValid)
			.sort((a: Interval, b: Interval) => a.start!.toMillis() - b.start!.toMillis());

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
		console.log('🗓️ [DEBUG] Day iteration:', {
			windowStart: windowStart.toISO(),
			windowEnd: windowEnd.toISO(),
			windowStartDay: windowStart.startOf('day').toISO(),
			windowEndDay: windowEnd.startOf('day').toISO()
		});
		
		for (let d = windowStart.startOf('day'); d < windowEnd; d = d.plus({ days: 1 })) {
			const start = d.set({ hour: dayStartHour, minute: 0 });
			const end = d.set({ hour: dayEndHour, minute: 0 });
			const dayI = Interval.fromDateTimes(
				start < windowStart ? windowStart : start,
				end > windowEnd ? windowEnd : end,
			);
			console.log('📅 [DEBUG] Processing day:', {
				date: d.toISODate(),
				start: start.toISO(),
				end: end.toISO(),
				dayInterval: dayI.isValid ? `${dayI.start?.toISO()} to ${dayI.end?.toISO()}` : 'invalid'
			});
			if (dayI.isValid) dayIntervals.push(dayI);
		}
		
		console.log('📊 [DEBUG] Generated day intervals:', {
			count: dayIntervals.length,
			dates: dayIntervals.map(d => d.start?.toISODate())
		});

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
		
		// Group free intervals by day to distribute slots evenly
		const freeByDay = new Map<string, Interval[]>();
		for (const f of free) {
			const dayKey = f.start!.toISODate();
			if (!freeByDay.has(dayKey)) {
				freeByDay.set(dayKey, []);
			}
			freeByDay.get(dayKey)!.push(f);
		}
		
		console.log('📊 [DEBUG] Free intervals by day:', {
			dayCount: freeByDay.size,
			days: Array.from(freeByDay.keys()),
			intervalsPerDay: Array.from(freeByDay.entries()).map(([day, intervals]) => ({
				day,
				count: intervals.length
			}))
		});
		
		// Calculate slots per day to distribute evenly, but be much more generous
		const days = Array.from(freeByDay.keys());
		const slotsPerDay = Math.max(8, Math.floor(maxCandidates / days.length)); // Increased from 2 to 8
		console.log('📊 [DEBUG] Slot distribution:', {
			totalDays: days.length,
			slotsPerDay,
			maxCandidates
		});
		
		for (const [dayKey, dayIntervals] of freeByDay) {
			let daySlotCount = 0;
			for (const f of dayIntervals) {
				let s = f.start!.plus({ minutes: minBufferMinutes });
				const latestStart = f.end!.minus(dur).minus({ minutes: minBufferMinutes });
				
				// Round start time to nearest 30-minute mark (top or bottom of hour)
				const startMinute = s.minute;
				const roundedMinute = startMinute <= 30 ? 0 : 30;
				s = s.set({ minute: roundedMinute, second: 0, millisecond: 0 });
				
				// If rounding backward puts us before the interval start, move forward to next 30-min mark
				if (s < f.start!) {
					s = s.plus({ minutes: 30 });
				}
				
				// Generate slots at 30-minute intervals (9:00, 9:30, 10:00, 10:30, etc.)
				while (s <= latestStart && daySlotCount < slotsPerDay && slots.length < maxCandidates) {
					const e = s.plus(dur);
					if (Interval.fromDateTimes(s, e).isValid) {
						slots.push({ startISO: s.toISO(), endISO: e.toISO() });
						daySlotCount++;
					}
					// Move to next 30-minute slot
					s = s.plus({ minutes: 30 });
				}
				if (slots.length >= maxCandidates) break;
			}
			if (slots.length >= maxCandidates) break;
		}
		
		const computationTime = Date.now() - startTime;
		console.log('✅ [DEBUG] Generated free slots:', {
			slotCount: slots.length,
			computationTime: `${computationTime}ms`,
			slots: slots.slice(0, 5).map(s => ({
				start: new Date(s.startISO).toLocaleString(),
				end: new Date(s.endISO).toLocaleString()
			}))
		});
		
		// Cache the result
		setCachedData(cacheKey, slots, CACHE_TTL.FREE_SLOTS);
		
		return slots;
	} catch (error) {
		console.error('❌ [DEBUG] Error computing free slots:', error);
		
		if (isSSLError(error)) {
			console.warn('🔒 [DEBUG] SSL/TLS error detected');
		}
		
		// Always throw the error - no fallback to mock data
		throw new Error(`Failed to compute free slots: ${error instanceof Error ? error.message : String(error)}`);
	}
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

	try {
		const auth = getAuth();
		
		// Ensure fresh access token for OAuth2
		await auth.getAccessToken();

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
	} catch (error) {
		console.error('Error creating calendar event:', error);
		
		if (isSSLError(error)) {
			console.warn('🔒 [DEBUG] SSL/TLS error detected');
		}
		
		// Always throw the error - no mock response
		throw new Error(`Failed to create calendar event: ${error instanceof Error ? error.message : String(error)}`);
	}
}
