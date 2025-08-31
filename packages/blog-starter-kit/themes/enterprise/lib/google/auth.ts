let google: any;

try {
	google = require('googleapis');
} catch (error) {
	console.warn('[google-auth] googleapis not available');
	google = null;
}

const {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI,
	GOOGLE_OAUTH_REFRESH_TOKEN,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
	// Don't throw; routes that need this will handle errors cleanly.
	console.warn('[google-auth] Missing OAuth envs. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI.');
}

export function getOAuth2Client() {
	if (!google) {
		throw new Error('googleapis not available');
	}
	
	const oauth2Client = new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		GOOGLE_REDIRECT_URI
	);

	// If we've already captured a refresh token, load it.
	if (GOOGLE_OAUTH_REFRESH_TOKEN) {
		oauth2Client.setCredentials({ refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN });
	}
	return oauth2Client;
}

export function getCalendar() {
	if (!google) {
		throw new Error('googleapis not available');
	}
	
	const auth = getOAuth2Client();
	return google.calendar({ version: 'v3', auth });
}


