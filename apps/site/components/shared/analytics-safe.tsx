import { useEffect } from 'react';

// Safe analytics component that won't cause runtime errors
export const AnalyticsSafe = () => {
	useEffect(() => {
		// Only run in production and when window is available
		if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
			return;
		}

		// Check if gtag exists before using it
		if (typeof window.gtag === 'function') {
			try {
				window.gtag('config', 'G-72XG3F8LNJ', {
					transport_url: 'https://ping.hashnode.com',
					first_party_collection: true,
				});
			} catch (error) {
				console.warn('Google Analytics error:', error);
			}
		}
	}, []);

	return null;
};
