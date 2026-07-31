import { useCallback, useEffect } from 'react';

import { useAppContext } from './contexts/appContext';

// Declare gtag for TypeScript
declare global {
	interface Window {
		gtag: (...args: any[]) => void;
	}
}
const GA_TRACKING_ID = 'G-72XG3F8LNJ';
const isProd = process.env.NEXT_PUBLIC_MODE === 'production';
const isDev = process.env.NODE_ENV === 'development';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || '';

export const Analytics = () => {
	const { publication, post, series, page } = useAppContext();

	const _sendPageViewsToGoogleAnalytics = useCallback(() => {
		// Check if gtag exists and is a function
		if (typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function') {
			// @ts-ignore
			window.gtag('config', GA_TRACKING_ID);
		} else {
			console.warn('Google Analytics (gtag) not available');
		}
	}, []);

	const _sendViewsToAdvancedAnalyticsDashboard = useCallback(() => {
		const publicationId = publication.id;
		const postId = post && post.id;
		const seriesId = series?.id || post?.series?.id;
		const staticPageId = page && page.id;

		const data = {
			publicationId,
			postId,
			seriesId,
			staticPageId,
		};

		if (!publicationId) {
			console.warn('Publication ID is missing; could not send analytics.');
			return;
		}

		const isBrowser = typeof window !== 'undefined';
		if (!isBrowser) {
			return;
		}

		const isLocalhost = window.location.hostname === 'localhost';
		if (isLocalhost) {
			console.warn(
				'Analytics API call is skipped because you are running on localhost; data:',
				data,
			);
			return;
		}

		const event = {
			// timestamp will be added in API
			payload: {
				publicationId,
				postId: postId || null,
				seriesId: seriesId || null,
				pageId: staticPageId || null,
				url: window.location.href,
				referrer: document.referrer || null,
				language: navigator.language || null,
				screen: `${window.screen.width}x${window.screen.height}`,
			},
			type: 'pageview',
		};

		const blob = new Blob(
			[
				JSON.stringify({
					events: [event],
				}),
			],
			{
				type: 'application/json; charset=UTF-8',
			},
		);

		let hasSentBeacon = false;
		try {
			if (navigator.sendBeacon) {
				hasSentBeacon = navigator.sendBeacon(`${BASE_PATH}/api/analytics`, blob);
			}
		} catch (error) {
			// do nothing; in case there is an error we fall back to fetch
		}

		if (!hasSentBeacon) {
			fetch(`${BASE_PATH}/api/analytics`, {
				method: 'POST',
				body: blob,
				credentials: 'omit',
				keepalive: true,
			});
		}
	}, [publication.id, post, series, page]);

	useEffect(() => {
		// Skip analytics in development mode
		if (isDev) {
			// Analytics disabled in development mode
			return;
		}

		// Skip analytics if not in production
		if (!isProd) return;

		// Only run analytics in browser environment
		if (typeof window === 'undefined') return;

		_sendPageViewsToGoogleAnalytics();
		_sendViewsToAdvancedAnalyticsDashboard();
	}, [
		_sendPageViewsToGoogleAnalytics,
		_sendViewsToAdvancedAnalyticsDashboard,
	]);

	return null;
};
