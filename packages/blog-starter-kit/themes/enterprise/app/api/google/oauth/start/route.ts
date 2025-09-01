export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

// Conditional import to handle missing googleapis during build
let getOAuth2Client: any;
try {
	const { getOAuth2Client: importedGetOAuth2Client } = require('../../../../../lib/google/auth');
	getOAuth2Client = importedGetOAuth2Client;
} catch (error) {
	console.warn('googleapis not available, OAuth will not work');
	getOAuth2Client = null;
}

const SCOPES = [
	'https://www.googleapis.com/auth/calendar',
	'https://www.googleapis.com/auth/calendar.events',
];

export async function GET() {
	// Check if OAuth is available
	if (!getOAuth2Client) {
		return NextResponse.json({ error: 'OAuth not configured' }, { status: 503 });
	}

	try {
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
	} catch (error) {
		console.error('OAuth error:', error);
		return NextResponse.json({ error: 'OAuth configuration error' }, { status: 500 });
	}
}
