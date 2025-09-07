let google: any;

try {
	google = require('googleapis');
} catch (error) {
	console.warn('[google-auth] googleapis not available');
	google = null;
}

import { env, features, sslConfig } from '@/lib/env-validation';

// Check if OAuth2 credentials are available
const hasOAuth2Credentials = features.googleCalendar;

if (!hasOAuth2Credentials) {
	console.warn(
		'[google-auth] OAuth2 credentials not found. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.',
	);
}

// SSL/TLS fix for Node.js 20+ compatibility
if (sslConfig.fixEnabled) {
	try {
		const crypto = require('crypto');
		const originalCreateHash = crypto.createHash;
		crypto.createHash = function(algorithm: string) {
			if (algorithm === 'sha1') {
				return originalCreateHash.call(this, 'sha256');
			}
			return originalCreateHash.call(this, algorithm);
		};
		console.log('[google-auth] SSL compatibility fix applied');
	} catch (error) {
		console.warn('[google-auth] Failed to apply SSL fix:', error);
	}
}

export function getOAuth2Client() {
	if (!google) {
		throw new Error('googleapis not available');
	}

	if (!hasOAuth2Credentials) {
		throw new Error('OAuth2 credentials not configured');
	}

	const oauth2Client = new google.auth.OAuth2(
		env.GOOGLE_CLIENT_ID,
		env.GOOGLE_CLIENT_SECRET,
		env.GOOGLE_REDIRECT_URI,
	);

	if (!oauth2Client) {
		throw new Error('Failed to create OAuth2 client instance');
	}

	// If we've already captured a refresh token, load it.
	if (env.GOOGLE_OAUTH_REFRESH_TOKEN) {
		oauth2Client.setCredentials({ refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN });
	}
	return oauth2Client;
}

export function getAuth() {
	if (!hasOAuth2Credentials) {
		throw new Error('OAuth2 credentials not configured');
	}

	const auth = getOAuth2Client();
	if (!auth) {
		throw new Error('Failed to create OAuth2 client');
	}
	
	return auth;
}

export function getCalendar() {
	if (!google) {
		throw new Error('googleapis not available');
	}

	const auth = getAuth();
	return google.calendar({ version: 'v3', auth });
}
