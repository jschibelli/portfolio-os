export const runtime = 'nodejs';

import { getCalendar, getAuth } from '@/lib/google/auth';
import { NextResponse } from 'next/server';

export async function GET() {
	const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
	let freebusyOk = false;
	let hint: string | null = null;
	let authMethod: string | null = null;
	let sslError = false;

	try {
		const auth = getAuth();
		authMethod = auth?.constructor?.name || 'Unknown';
		
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
		sslError = hint.includes('ERR_OSSL_UNSUPPORTED') || 
				   hint.includes('DECODER routines') ||
				   hint.includes('SSL') ||
				   hint.includes('TLS');
		
		// Enhanced SSL error logging for troubleshooting
		if (sslError) {
			console.error('[schedule-health] SSL/TLS error detected:', {
				error: hint,
				authMethod,
				sslFixEnabled: process.env.FIX_SSL_ISSUES === 'true',
				timestamp: new Date().toISOString()
			});
		}
	}

	// Check OAuth2 credentials
	const hasOAuth2Credentials = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI);

	return NextResponse.json({
		freebusyOk,
		calendarId,
		hint,
		authMethod,
		sslError,
		authenticationMethod: 'OAuth2',
		oauth2Configured: hasOAuth2Credentials,
		requiredEnvs: {
			GOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
			GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
			GOOGLE_REDIRECT_URI: Boolean(process.env.GOOGLE_REDIRECT_URI),
			GOOGLE_OAUTH_REFRESH_TOKEN: Boolean(process.env.GOOGLE_OAUTH_REFRESH_TOKEN),
		},
		sslFix: {
			FIX_SSL_ISSUES: process.env.FIX_SSL_ISSUES === 'true',
		},
	});
}
