export const runtime = 'nodejs';

import { getCalendar, getAuth } from '@/lib/google/auth';
import { env, features, sslConfig } from '@/lib/env-validation';
import { NextResponse } from 'next/server';

export async function GET() {
	const calendarId = env.GOOGLE_CALENDAR_ID;
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
        sslError = !!(hint && (hint.includes('ERR_OSSL_UNSUPPORTED') ||
				   hint.includes('DECODER routines') ||
				   hint.includes('SSL') ||
				   hint.includes('TLS')));
		
		// Enhanced SSL error logging for troubleshooting (without exposing sensitive data)
		if (sslError) {
			console.error('[schedule-health] SSL/TLS error detected:', {
				errorType: 'SSL_TLS_ERROR',
                          errorCode: hint?.includes('ERR_OSSL_UNSUPPORTED') ? 'ERR_OSSL_UNSUPPORTED' : 'SSL_DECODER_ERROR',
				authMethod,
				sslFixEnabled: sslConfig.fixEnabled,
				environment: env.NODE_ENV,
				timestamp: new Date().toISOString()
			});
		} else {
			// Log non-SSL errors with appropriate level
			console.warn('[schedule-health] Calendar API error:', {
				errorType: 'CALENDAR_API_ERROR',
				authMethod,
				hasCredentials: features.googleCalendar,
				timestamp: new Date().toISOString()
			});
		}
	}

	return NextResponse.json({
		freebusyOk,
		calendarId,
		hint,
		authMethod,
		sslError,
		authenticationMethod: 'OAuth2',
		oauth2Configured: features.googleCalendar,
		requiredEnvs: {
			GOOGLE_CLIENT_ID: Boolean(env.GOOGLE_CLIENT_ID),
			GOOGLE_CLIENT_SECRET: Boolean(env.GOOGLE_CLIENT_SECRET),
			GOOGLE_REDIRECT_URI: Boolean(env.GOOGLE_REDIRECT_URI),
			GOOGLE_OAUTH_REFRESH_TOKEN: Boolean(env.GOOGLE_OAUTH_REFRESH_TOKEN),
		},
		sslFix: {
			FIX_SSL_ISSUES: sslConfig.fixEnabled,
		},
		features: features,
		environment: env.NODE_ENV,
	});
}
