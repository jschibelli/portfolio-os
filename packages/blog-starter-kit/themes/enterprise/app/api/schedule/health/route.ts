export const runtime = 'nodejs';

import { getCalendar } from '@/lib/google/auth';
import { NextResponse } from 'next/server';

export async function GET() {
	const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
	let freebusyOk = false;
	let hint: string | null = null;
	try {
		const cal = getCalendar();
		const now = new Date();
		const end = new Date(now.getTime() + 24 * 3600 * 1000);
		const res = await cal.freebusy.query({
			requestBody: {
				timeMin: now.toISOString(),
				timeMax: end.toISOString(),
				items: [{ id: calendarId }],
				timeZone: 'America/New_York',
			},
		});
		freebusyOk = !!res.data.calendars;
	} catch (e: any) {
		hint = e?.message || String(e);
	}

	return NextResponse.json({
		freebusyOk,
		calendarId,
		hint,
		requiredEnvs: {
			GOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
			GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
			GOOGLE_REDIRECT_URI: Boolean(process.env.GOOGLE_REDIRECT_URI),
			GOOGLE_OAUTH_REFRESH_TOKEN: Boolean(process.env.GOOGLE_OAUTH_REFRESH_TOKEN),
		},
	});
}
