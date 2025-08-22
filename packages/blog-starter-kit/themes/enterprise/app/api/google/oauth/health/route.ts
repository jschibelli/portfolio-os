export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/google/auth';

export async function GET() {
	const envs = {
		GOOGLE_CLIENT_ID: Boolean(process.env.GOOGLE_CLIENT_ID),
		GOOGLE_CLIENT_SECRET: Boolean(process.env.GOOGLE_CLIENT_SECRET),
		GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || null,
		GOOGLE_OAUTH_REFRESH_TOKEN: Boolean(process.env.GOOGLE_OAUTH_REFRESH_TOKEN),
		GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID || 'primary',
	};

	let accessTokenOk = false;
	let tokenHint: string | null = null;
	try {
		if (envs.GOOGLE_CLIENT_ID && envs.GOOGLE_CLIENT_SECRET && envs.GOOGLE_REDIRECT_URI) {
			const oauth = getOAuth2Client();
			if (process.env.GOOGLE_OAUTH_REFRESH_TOKEN) {
				const t = await oauth.getAccessToken();
				accessTokenOk = Boolean(t && t.token);
				tokenHint = accessTokenOk ? 'ok' : 'no_token';
			} else {
				tokenHint = 'missing_refresh_token';
			}
		} else {
			tokenHint = 'missing_oauth_envs';
		}
	} catch (e: any) {
		tokenHint = e?.message || 'token_error';
	}

	return NextResponse.json({
		ok: true,
		routes: {
			oauthStart: '/api/google/oauth/start',
			oauthCallback: '/api/google/oauth/callback',
		},
		redirectUriNote: 'Ensure this URI is added in Google Cloud OAuth “Authorized redirect URIs”.',
		envs,
		accessTokenOk,
		tokenHint,
	});
}


