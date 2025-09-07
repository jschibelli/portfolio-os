let google: any;

try {
	google = require('googleapis');
} catch (error) {
	console.warn('[google-auth] googleapis not available');
	google = null;
}

import { env, features, sslConfig } from '@/lib/env-validation';

/**
 * Standardized logging utility for Google Calendar integration
 * 
 * Provides consistent log levels and structured logging across all functions:
 * - ERROR: Critical failures that prevent functionality
 * - WARN: Issues that affect functionality but have fallbacks
 * - INFO: Important state changes and successful operations
 * - DEBUG: Detailed diagnostic information for troubleshooting
 */
const logger = {
	error: (message: string, context: Record<string, any> = {}) => {
		console.error(`[google-auth] ${message}`, {
			...context,
			timestamp: new Date().toISOString(),
			service: 'google-calendar'
		});
	},
	warn: (message: string, context: Record<string, any> = {}) => {
		console.warn(`[google-auth] ${message}`, {
			...context,
			timestamp: new Date().toISOString(),
			service: 'google-calendar'
		});
	},
	info: (message: string, context: Record<string, any> = {}) => {
		console.info(`[google-auth] ${message}`, {
			...context,
			timestamp: new Date().toISOString(),
			service: 'google-calendar'
		});
	},
	debug: (message: string, context: Record<string, any> = {}) => {
		console.debug(`[google-auth] ${message}`, {
			...context,
			timestamp: new Date().toISOString(),
			service: 'google-calendar'
		});
	}
};

// Check if OAuth2 credentials are available
const hasOAuth2Credentials = features.googleCalendar;

/**
 * Credential monitoring and notification system
 * 
 * This structured approach provides better visibility into credential status
 * and can be easily extended to integrate with monitoring systems like:
 * - Sentry for error tracking
 * - DataDog for infrastructure monitoring
 * - Custom webhook notifications
 */
if (!hasOAuth2Credentials) {
	const credentialStatus = {
		status: 'MISSING_CREDENTIALS',
		service: 'google-calendar',
		required: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI', 'GOOGLE_OAUTH_REFRESH_TOKEN'],
		impact: 'Calendar integration will fall back to mock data',
		timestamp: new Date().toISOString()
	};
	
	logger.warn('OAuth2 credentials not found', credentialStatus);
	
	// TODO: Integrate with centralized monitoring system
	// Example: sendToMonitoring(credentialStatus);
}

/**
 * SSL/TLS compatibility fix for Node.js 20+ with Google APIs
 * 
 * PROBLEM:
 * Node.js 20+ uses OpenSSL 3.0 which deprecated legacy algorithms including SHA1.
 * The Google APIs client library (googleapis) still uses SHA1 for certain operations,
 * causing "error:1E08010C:DECODER routines::unsupported" errors.
 * 
 * SOLUTION:
 * This workaround intercepts crypto.createHash calls and substitutes SHA1 with SHA256
 * for compatibility with the Google APIs client library while maintaining security.
 * 
 * SECURITY CONSIDERATIONS:
 * - SHA256 is cryptographically stronger than SHA1
 * - This substitution is safe for the Google APIs use case
 * - The fix only applies when FIX_SSL_ISSUES=true in environment variables
 * 
 * ALTERNATIVE SOLUTIONS:
 * 1. Use --openssl-legacy-provider Node.js flag (less secure)
 * 2. Downgrade to Node.js 18 (not recommended for production)
 * 3. Wait for googleapis library to update (may take time)
 * 
 * @see https://nodejs.org/en/blog/release/v20.0.0#openssl-3-0
 * @see https://github.com/googleapis/google-api-nodejs-client/issues/2985
 */
if (sslConfig.fixEnabled) {
	try {
		const crypto = require('crypto');
		const originalCreateHash = crypto.createHash;
		
		/**
		 * Override crypto.createHash to intercept SHA1 calls and substitute with SHA256
		 * 
		 * This monkey-patch approach is necessary because:
		 * 1. The googleapis library internally uses SHA1 for JWT token generation
		 * 2. Node.js 20+ OpenSSL 3.0 rejects SHA1 as a legacy algorithm
		 * 3. We cannot modify the googleapis library directly
		 * 
		 * The override preserves the original function signature and behavior
		 * while transparently upgrading SHA1 to SHA256 for compatibility.
		 */
		crypto.createHash = function(algorithm: string) {
			if (algorithm === 'sha1') {
				logger.debug('Converting SHA1 to SHA256 for SSL compatibility');
				return originalCreateHash.call(this, 'sha256');
			}
			return originalCreateHash.call(this, algorithm);
		};
		
		logger.info('SSL compatibility fix applied successfully');
	} catch (error) {
		logger.error('Failed to apply SSL fix', {
			error: error instanceof Error ? error.message : String(error),
			action: 'Applying SSL/TLS compatibility workaround for Node.js 20+',
			solution: 'Check if crypto module is available and FIX_SSL_ISSUES is properly set'
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
		logger.error('OAuth2 client creation failed', {
			error: error.message,
			action: 'Creating OAuth2 client for Google Calendar API',
			solution: 'Ensure googleapis package is installed: npm install googleapis'
		});
		throw error;
	}

	if (!hasOAuth2Credentials) {
		const error = new Error('OAuth2 credentials not configured - check environment variables');
		logger.error('OAuth2 client creation failed', {
			error: error.message,
			action: 'Validating OAuth2 credentials for Google Calendar integration',
			missingCredentials: {
				GOOGLE_CLIENT_ID: !env.GOOGLE_CLIENT_ID,
				GOOGLE_CLIENT_SECRET: !env.GOOGLE_CLIENT_SECRET,
				GOOGLE_REDIRECT_URI: !env.GOOGLE_REDIRECT_URI,
				GOOGLE_OAUTH_REFRESH_TOKEN: !env.GOOGLE_OAUTH_REFRESH_TOKEN
			},
			solution: 'Set all required OAuth2 environment variables in .env.local file',
			documentation: 'See docs/implementation/GOOGLE_CALENDAR_SETUP.md for setup instructions'
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
			logger.info('OAuth2 client configured with refresh token');
		} else {
			logger.warn('OAuth2 client created without refresh token - calendar operations may fail');
		}

		return oauth2Client;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error creating OAuth2 client';
		logger.error('OAuth2 client creation failed', {
			error: errorMessage,
			action: 'Initializing OAuth2 client with provided credentials',
			solution: 'Verify OAuth2 credentials are valid and properly formatted'
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
		logger.error('Authentication failed', {
			error: error.message,
			action: 'Creating authentication client for Google APIs',
			solution: 'Check OAuth2 credentials and ensure Google Calendar API is enabled'
		});
		throw error;
	}

	try {
		const auth = getOAuth2Client();
		if (!auth) {
			throw new Error('OAuth2 client creation returned null/undefined');
		}
		
		logger.info('Authentication client created successfully');
		return auth;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
		logger.error('Authentication failed', {
			error: errorMessage,
			action: 'Getting authenticated OAuth2 client',
			solution: 'Verify OAuth2 client creation and credential configuration'
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
		logger.error('Calendar client creation failed', {
			error: error.message,
			action: 'Creating Google Calendar API client',
			solution: 'Ensure googleapis package is installed and authentication is working'
		});
		throw error;
	}

	try {
		const auth = getAuth();
		const calendar = google.calendar({ version: 'v3', auth });
		
		if (!calendar) {
			throw new Error('Calendar client creation returned null/undefined');
		}
		
		logger.info('Calendar client created successfully');
		return calendar;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown calendar client error';
		logger.error('Calendar client creation failed', {
			error: errorMessage,
			action: 'Initializing Google Calendar API client with authentication',
			solution: 'Check authentication client and Google Calendar API access'
		});
		throw new Error(`Calendar client creation failed: ${errorMessage}`);
	}
}
