export const runtime = 'nodejs';

import { getOAuth2Client } from '@/lib/google/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get('code');
	const error = searchParams.get('error');

	if (error) {
		return new Response(`OAuth error: ${error}`, {
			status: 400,
			headers: { 'content-type': 'text/plain' },
		});
	}
	if (!code) {
		return new Response('Missing code', { status: 400, headers: { 'content-type': 'text/plain' } });
	}

	const oauth2 = getOAuth2Client();
	try {
		const { tokens } = await oauth2.getToken(code);
		// Refresh token appears only on first consent (or if prompt=consent).
		const refresh = tokens.refresh_token;
		const access = tokens.access_token;

		// Show a minimal page instructing to copy the refresh token to env/secrets.
		const html = `
			<html><body style="font:14px system-ui; padding:24px;">
				<h2>Google OAuth Success</h2>
				<p>Copy the <strong>refresh token</strong> below into your Vercel env as <code>GOOGLE_OAUTH_REFRESH_TOKEN</code>, then remove any local copies.</p>
				${refresh ? `<pre style="background:#111;color:#0f0;padding:12px;white-space:pre-wrap;word-break:break-all;">${refresh}</pre>` : `<p><em>No refresh_token returned.</em> If you’ve previously granted access, revoke access and try again with <code>prompt=consent</code>.</p>`}
				<p>Access token (temporary):</p>
				<pre style="background:#111;color:#999;padding:12px;white-space:pre-wrap;word-break:break-all;">${access ?? '(not shown)'}</pre>
				<p>You can close this tab.</p>
			</body></html>
		`;
		return new Response(html, { headers: { 'content-type': 'text/html' } });
	} catch (e: any) {
		return new Response(`Token exchange failed: ${e?.message || e}`, {
			status: 500,
			headers: { 'content-type': 'text/plain' },
		});
	}
}
