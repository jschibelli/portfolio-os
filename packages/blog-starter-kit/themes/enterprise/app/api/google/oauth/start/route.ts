export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/google/auth';

const SCOPES = [
	'https://www.googleapis.com/auth/calendar',
	'https://www.googleapis.com/auth/calendar.events',
];

export async function GET() {
	const oauth2 = getOAuth2Client();
	if (!oauth2) {
		return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 });
	}

	const url = oauth2.generateAuthUrl({
		access_type: 'offline',
		prompt: 'consent',
		scope: SCOPES,
	});

	return NextResponse.redirect(url);
}


