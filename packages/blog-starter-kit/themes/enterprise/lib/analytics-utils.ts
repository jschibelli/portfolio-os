/**
 * Analytics Utilities
 * 
 * This module provides utility functions for tracking analytics events
 * across the application, including newsletter subscriptions and other
 * user interactions.
 */

// Declare gtag for TypeScript
declare global {
	interface Window {
		gtag: (...args: any[]) => void;
	}
}

export interface AnalyticsEvent {
	event: string;
	event_category?: string;
	event_label?: string;
	value?: number;
	[key: string]: any;
}

export interface NewsletterSubscriptionEvent extends AnalyticsEvent {
	event: 'newsletter_subscription';
	event_category: 'engagement';
	event_label: 'newsletter_signup';
	email_domain?: string;
	source?: string;
}

export class AnalyticsUtils {
	/**
	 * Check if analytics is available and enabled
	 */
	static isAnalyticsAvailable(): boolean {
		return typeof window !== 'undefined' && 
			   typeof window.gtag === 'function' && 
			   process.env.NODE_ENV === 'production';
	}

	/**
	 * Track a custom analytics event
	 */
	static trackEvent(event: AnalyticsEvent): void {
		if (!this.isAnalyticsAvailable()) {
			console.warn('Analytics not available, event not tracked:', event);
			return;
		}

		try {
			window.gtag('event', event.event, {
				event_category: event.event_category,
				event_label: event.event_label,
				value: event.value,
				...event
			});
		} catch (error) {
			console.error('Failed to track analytics event:', error);
		}
	}

	/**
	 * Track page view
	 */
	static trackPageView(pagePath: string, pageTitle?: string): void {
		if (!this.isAnalyticsAvailable()) {
			return;
		}

		try {
			window.gtag('config', 'G-72XG3F8LNJ', {
				page_path: pagePath,
				page_title: pageTitle,
				transport_url: 'https://ping.hashnode.com',
				first_party_collection: true,
			});
		} catch (error) {
			console.error('Failed to track page view:', error);
		}
	}

	/**
	 * Track newsletter subscription
	 */
	static trackNewsletterSubscription(email: string, source?: string): void {
		const emailDomain = email.split('@')[1];
		
		const event: NewsletterSubscriptionEvent = {
			event: 'newsletter_subscription',
			event_category: 'engagement',
			event_label: 'newsletter_signup',
			email_domain: emailDomain,
			source: source || 'unknown'
		};

		this.trackEvent(event);
	}

	/**
	 * Track case study interaction
	 */
	static trackCaseStudyInteraction(action: string, caseStudySlug: string): void {
		this.trackEvent({
			event: 'case_study_interaction',
			event_category: 'engagement',
			event_label: action,
			case_study_slug: caseStudySlug
		});
	}

	/**
	 * Track chatbot interaction
	 */
	static trackChatbotInteraction(action: string, messageCount?: number): void {
		this.trackEvent({
			event: 'chatbot_interaction',
			event_category: 'engagement',
			event_label: action,
			message_count: messageCount
		});
	}

	/**
	 * Track form submission
	 */
	static trackFormSubmission(formName: string, success: boolean): void {
		this.trackEvent({
			event: 'form_submission',
			event_category: 'engagement',
			event_label: formName,
			success: success
		});
	}

	/**
	 * Track download
	 */
	static trackDownload(fileName: string, fileType: string): void {
		this.trackEvent({
			event: 'file_download',
			event_category: 'engagement',
			event_label: fileName,
			file_type: fileType
		});
	}

	/**
	 * Track external link click
	 */
	static trackExternalLink(url: string, linkText?: string): void {
		this.trackEvent({
			event: 'external_link_click',
			event_category: 'outbound',
			event_label: linkText || url,
			link_url: url
		});
	}
}

/**
 * Convenience function for tracking newsletter subscriptions
 */
export function trackNewsletterSubscription(email: string, source?: string): void {
	AnalyticsUtils.trackNewsletterSubscription(email, source);
}

/**
 * Convenience function for tracking page views
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
	AnalyticsUtils.trackPageView(pagePath, pageTitle);
}

/**
 * Convenience function for tracking custom events
 */
export function trackEvent(event: AnalyticsEvent): void {
	AnalyticsUtils.trackEvent(event);
}
