import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { Resend } from 'resend';
import { SITE_CONFIG } from '@/config/constants';

let google: any;
let calendar: any;

try {
	google = require('googleapis');
	calendar = google.calendar('v3');
} catch (error) {
	console.warn('[book-api] googleapis not available');
	google = null;
	calendar = null;
}
// Conditional Prisma import
let prisma: any = null;
try {
	const { PrismaClient } = require('@prisma/client');
	prisma = new PrismaClient();
} catch (error) {
	console.log('Prisma not available - using mock booking functionality');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation utility
function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Enhanced error handling for email sending
async function sendConfirmationEmail(email: string, name: string, date: string, time: string) {
	if (!isValidEmail(email)) {
		throw new Error(`Invalid email address: ${email}`);
	}

	const contactEmail = process.env.CONTACT_EMAIL || SITE_CONFIG.EMAIL.CONTACT;
	
	try {
		const result = await resend.emails.send({
			from: `John Schibelli <${contactEmail}>`,
			to: [email],
			subject: 'Meeting Confirmed - John Schibelli',
			html: `
				<h2>Meeting Confirmed!</h2>
				<p>Hi ${name},</p>
				<p>Your meeting has been scheduled for:</p>
				<p><strong>Date:</strong> ${date}</p>
				<p><strong>Time:</strong> ${time}</p>
				<p>Looking forward to speaking with you!</p>
				<p>Best regards,<br>John Schibelli</p>
			`,
		});

		if (result.error) {
			throw new Error(`Email sending failed: ${result.error.message}`);
		}

		return result;
	} catch (error) {
		console.error('Email sending error:', error);
		throw new Error(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	// Check feature flag
	if (process.env.FEATURE_SCHEDULING !== 'true') {
		return res.status(503).json({ error: 'Scheduling feature is disabled' });
	}

	// Check if googleapis is available
	if (!google || !calendar) {
		return res.status(503).json({ error: 'Google Calendar API not available' });
	}

	try {
		const { name, email, timezone, startTime, endTime, meetingType, notes } = req.body;

		// Validate email address
		if (!isValidEmail(email)) {
			return res.status(400).json({ 
				error: 'Invalid email address format',
				details: 'Please provide a valid email address'
			});
		}

		// Validate required fields
		if (!name || !email || !timezone || !startTime || !endTime) {
			return res.status(400).json({
				error: 'Missing required fields: name, email, timezone, startTime, endTime',
			});
		}

		// Input sanitization and validation
		const sanitizedName = name.trim().replace(/[<>]/g, '');
		const sanitizedEmail = email.trim().toLowerCase();
		const sanitizedNotes = notes ? notes.trim().replace(/[<>]/g, '') : '';
		const sanitizedMeetingType = meetingType ? meetingType.trim().replace(/[<>]/g, '') : 'General Discussion';

		// Validate name length and content
		if (sanitizedName.length < 2 || sanitizedName.length > 100) {
			return res.status(400).json({
				error: 'Name must be between 2 and 100 characters',
			});
		}

		// Validate notes length if provided
		if (sanitizedNotes && sanitizedNotes.length > 1000) {
			return res.status(400).json({
				error: 'Notes must be less than 1000 characters',
			});
		}

		// Log booking attempt for audit purposes
		console.log('Booking attempt:', {
			name: sanitizedName,
			email: sanitizedEmail,
			timezone,
			startTime,
			endTime,
			meetingType: sanitizedMeetingType,
			timestamp: new Date().toISOString()
		});

		// Validate email format (already done above, but keeping for consistency)
		if (!isValidEmail(sanitizedEmail)) {
			return res.status(400).json({ error: 'Invalid email format' });
		}

		// Validate timezone
		try {
			Intl.DateTimeFormat(undefined, { timeZone: timezone });
		} catch {
			return res.status(400).json({ error: 'Invalid timezone' });
		}

		// Validate time range
		const start = new Date(startTime);
		const end = new Date(endTime);
		const now = new Date();

		if (start <= now) {
			return res.status(400).json({ error: 'Start time must be in the future' });
		}

		if (end <= start) {
			return res.status(400).json({ error: 'End time must be after start time' });
		}

		// Prefer env-based credentials (service account JSON values)
		let auth: any;
		if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
			auth = new google.auth.GoogleAuth({
				credentials: {
					type: process.env.GOOGLE_TYPE || 'service_account',
					project_id: process.env.GOOGLE_PROJECT_ID,
					private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
					private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
						.replace(/"/g, '')
						.trim(),
					client_email: process.env.GOOGLE_CLIENT_EMAIL,
					client_id: process.env.GOOGLE_CLIENT_ID,
				},
				scopes: [
					'https://www.googleapis.com/auth/calendar',
					'https://www.googleapis.com/auth/calendar.events',
				],
			});
		} else if (process.env.GOOGLE_SERVICE_ACCOUNT_PATH) {
			// Fallback to key file if provided
			const serviceAccountPath = path.join(process.cwd(), process.env.GOOGLE_SERVICE_ACCOUNT_PATH);
			auth = new google.auth.GoogleAuth({
				keyFile: serviceAccountPath,
				scopes: [
					'https://www.googleapis.com/auth/calendar',
					'https://www.googleapis.com/auth/calendar.events',
				],
			});
		} else {
			return res.status(500).json({ error: 'Google Calendar credentials not configured' });
		}

		// Create Google Calendar event with Meet link
		const event = {
			summary: `Meeting with ${sanitizedName}`,
			description:
				sanitizedNotes ||
				`Meeting scheduled via website chatbot.\n\nContact: ${sanitizedEmail}\nMeeting Type: ${sanitizedMeetingType}`,
			start: {
				dateTime: start.toISOString(),
				timeZone: timezone,
			},
			end: {
				dateTime: end.toISOString(),
				timeZone: timezone,
			},
			conferenceData: {
				createRequest: {
					requestId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
					conferenceSolutionKey: { type: 'hangoutsMeet' },
				},
			},
			// Note: Service accounts cannot add attendees without Domain-Wide Delegation
			// The event will be created in John's calendar, and the confirmation email will be sent separately
			reminders: {
				useDefault: false,
				overrides: [
					{ method: 'email', minutes: 24 * 60 }, // 1 day before
					{ method: 'popup', minutes: 15 }, // 15 minutes before
				],
			},
		};

		const calendarResponse = await calendar.events.insert({
			auth: auth,
			calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
			requestBody: event,
			conferenceDataVersion: 1,
			sendUpdates: 'none', // Don't send invitations (service account limitation)
		});

		const googleEventId = calendarResponse.data.id;
		const meetLink =
			(calendarResponse.data as any)?.hangoutLink ||
			(calendarResponse.data as any)?.conferenceData?.entryPoints?.find(
				(e: any) => e.entryPointType === 'video',
			)?.uri ||
			null;
		const htmlLink = (calendarResponse.data as any)?.htmlLink || null;

		// Store booking in database (if available)
		let booking = null;
		if (prisma) {
			try {
				booking = await prisma.booking.create({
					data: {
						name,
						email,
						timezone,
						startTime: start,
						endTime: end,
						meetingType,
						notes,
						googleEventId,
						status: 'CONFIRMED',
					},
				});
			} catch (dbError) {
				console.warn('Database not available, continuing without storing booking:', dbError);
				// Continue without database storage
			}
		}

		// Send confirmation email with enhanced error handling and logging
		if (process.env.RESEND_API_KEY) {
			try {
				// Use already sanitized variables
				
				console.log(`Sending confirmation email to: ${sanitizedEmail} for meeting on ${start.toISOString()}`);
				
				const emailResult = await resend.emails.send({
					from: `John Schibelli <${process.env.CONTACT_EMAIL || SITE_CONFIG.EMAIL.CONTACT}>`,
					to: [sanitizedEmail],
					subject: 'Meeting Confirmed - John Schibelli',
					html: `
            <h2>Meeting Confirmed!</h2>
            <p>Hi ${sanitizedName},</p>
            <p>Your meeting with John Schibelli has been confirmed for:</p>
            <p><strong>Date:</strong> ${start.toLocaleDateString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}</p>
            <p><strong>Time:</strong> ${start.toLocaleTimeString('en-US', {
							hour: '2-digit',
							minute: '2-digit',
						})} - ${end.toLocaleTimeString('en-US', {
							hour: '2-digit',
							minute: '2-digit',
						})} (${timezone})</p>
            <p><strong>Type:</strong> ${meetingType || 'General Discussion'}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                         <p>The meeting has been added to John's calendar. If you need to reschedule, please contact John at jschibelli@gmail.com.</p>
            ${meetLink ? `<p><strong>Google Meet:</strong> <a href="${meetLink}">${meetLink}</a></p>` : ''}
            <p>Looking forward to our meeting!</p>
            <p>Best regards,<br>John Schibelli</p>
          `,
				});
			} catch (emailError) {
				console.error('Failed to send confirmation email:', {
					error: emailError,
					email: sanitizedEmail,
					meetingDate: start.toISOString(),
					timestamp: new Date().toISOString()
				});
				
				// Log specific error types for better debugging
				if (emailError instanceof Error) {
					console.error('Email error details:', {
						message: emailError.message,
						stack: emailError.stack,
						name: emailError.name
					});
				}
				
				// Don't fail the booking if email fails, but log for monitoring
				console.warn('Booking created successfully but email notification failed');
			}
		}

		// Send Slack notification
		if (process.env.SLACK_WEBHOOK_URL) {
			try {
				await fetch(process.env.SLACK_WEBHOOK_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						text: `📅 New meeting booked!\n\n*${sanitizedName}* (${sanitizedEmail})\n📅 ${start.toLocaleDateString()}\n⏰ ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}\n💬 ${sanitizedMeetingType}\n${sanitizedNotes ? `📝 ${sanitizedNotes}` : ''}`,
					}),
				});
			} catch (slackError) {
				console.error('Failed to send Slack notification:', slackError);
				// Don't fail the booking if Slack notification fails
			}
		}

		return res.status(200).json({
			success: true,
			booking: {
				id: booking?.id || 'temp-' + Date.now(),
				startTime: start,
				endTime: end,
				googleEventId,
				googleMeetLink: meetLink,
				googleEventLink: htmlLink,
			},
			message: 'Meeting booked successfully! Check your email for confirmation.',
		});
	} catch (error) {
		console.error('Error booking meeting:', error);
		return res.status(500).json({
			error: 'Failed to book meeting',
			details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
		});
	}
}
