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

/**
 * SSL/TLS compatibility fix for Node.js 20+ with Google APIs
 * 
 * This workaround addresses the "error:1E08010C:DECODER routines::unsupported" 
 * error that occurs when using Google Auth with Node.js 20+ due to OpenSSL changes.
 * 
 * The fix intercepts crypto.createHash calls and substitutes SHA1 with SHA256
 * for compatibility with the Google APIs client library.
 */
if (sslConfig.fixEnabled) {
	try {
		const crypto = require('crypto');
		const originalCreateHash = crypto.createHash;
		
		// Override createHash to handle SHA1 compatibility issues
		crypto.createHash = function(algorithm: string) {
			if (algorithm === 'sha1') {
				console.debug('[google-auth] Converting SHA1 to SHA256 for SSL compatibility');
				return originalCreateHash.call(this, 'sha256');
			}
			return originalCreateHash.call(this, algorithm);
		};
		
		console.log('[google-auth] SSL compatibility fix applied successfully');
	} catch (error) {
		console.error('[google-auth] Failed to apply SSL fix:', {
			error: error instanceof Error ? error.message : String(error),
			timestamp: new Date().toISOString()
		});
	}
}

/**
 * Creates and configures an OAuth2 client for Google Calendar API
 * 
 * @returns {Object} Configured OAuth2 client instance
 * @throws {Error} When googleapis is unavailable or credentials are missing
 */
export function getOAuth2Client() {
	if (!google) {
		const error = new Error('googleapis library not available - ensure googleapis package is installed');
		console.error('[google-auth] OAuth2 client creation failed:', {
			error: error.message,
			timestamp: new Date().toISOString()
		});
		throw error;
	}

	if (!hasOAuth2Credentials) {
		const error = new Error('OAuth2 credentials not configured - check environment variables');
		console.error('[google-auth] OAuth2 client creation failed:', {
			error: error.message,
			missingCredentials: {
				GOOGLE_CLIENT_ID: !env.GOOGLE_CLIENT_ID,
				GOOGLE_CLIENT_SECRET: !env.GOOGLE_CLIENT_SECRET,
				GOOGLE_REDIRECT_URI: !env.GOOGLE_REDIRECT_URI,
				GOOGLE_OAUTH_REFRESH_TOKEN: !env.GOOGLE_OAUTH_REFRESH_TOKEN
			},
			timestamp: new Date().toISOString()
		});
		throw error;
	}

	try {
		const oauth2Client = new google.auth.OAuth2(
			env.GOOGLE_CLIENT_ID,
			env.GOOGLE_CLIENT_SECRET,
			env.GOOGLE_REDIRECT_URI,
		);

		if (!oauth2Client) {
			throw new Error('OAuth2 client constructor returned null/undefined');
		}

		// Configure refresh token if available
		if (env.GOOGLE_OAUTH_REFRESH_TOKEN) {
			oauth2Client.setCredentials({ refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN });
			console.debug('[google-auth] OAuth2 client configured with refresh token');
		} else {
			console.warn('[google-auth] OAuth2 client created without refresh token');
		}

		return oauth2Client;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error creating OAuth2 client';
		console.error('[google-auth] OAuth2 client creation failed:', {
			error: errorMessage,
			timestamp: new Date().toISOString()
		});
		throw new Error(`Failed to create OAuth2 client: ${errorMessage}`);
	}
}

/**
 * Gets a configured authentication client for Google APIs
 * 
 * @returns {Object} Authenticated OAuth2 client
 * @throws {Error} When credentials are not configured or client creation fails
 */
export function getAuth() {
	if (!hasOAuth2Credentials) {
		const error = new Error('OAuth2 credentials not configured - check environment variables');
		console.error('[google-auth] Authentication failed:', {
			error: error.message,
			timestamp: new Date().toISOString()
		});
		throw error;
	}

	try {
		const auth = getOAuth2Client();
		if (!auth) {
			throw new Error('OAuth2 client creation returned null/undefined');
		}
		
		console.debug('[google-auth] Authentication client created successfully');
		return auth;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
		console.error('[google-auth] Authentication failed:', {
			error: errorMessage,
			timestamp: new Date().toISOString()
		});
		throw new Error(`Authentication failed: ${errorMessage}`);
	}
}

/**
 * Creates a Google Calendar API client with authentication
 * 
 * @returns {Object} Configured Google Calendar API client
 * @throws {Error} When googleapis is unavailable or authentication fails
 */
export function getCalendar() {
	if (!google) {
		const error = new Error('googleapis library not available - ensure googleapis package is installed');
		console.error('[google-auth] Calendar client creation failed:', {
			error: error.message,
			timestamp: new Date().toISOString()
		});
		throw error;
	}

	try {
		const auth = getAuth();
		const calendar = google.calendar({ version: 'v3', auth });
		
		if (!calendar) {
			throw new Error('Calendar client creation returned null/undefined');
		}
		
		console.debug('[google-auth] Calendar client created successfully');
		return calendar;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown calendar client error';
		console.error('[google-auth] Calendar client creation failed:', {
			error: errorMessage,
			timestamp: new Date().toISOString()
		});
		throw new Error(`Calendar client creation failed: ${errorMessage}`);
	}
}
