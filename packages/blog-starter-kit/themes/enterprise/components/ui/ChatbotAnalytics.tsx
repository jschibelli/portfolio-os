'use client';

import { useEffect, useState } from 'react';

interface ChatbotAnalytics {
	totalConversations: number;
	totalMessages: number;
	averageMessagesPerConversation: number;
	mostCommonIntents: Array<{ intent: string; count: number }>;
	popularActions: Array<{ action: string; count: number }>;
	conversationDuration: number;
	userSatisfaction: number;
}

interface AnalyticsEvent {
	type:
		| 'conversation_start'
		| 'message_sent'
		| 'intent_detected'
		| 'action_clicked'
		| 'conversation_end';
	data: any;
	timestamp: string;
}

export default function ChatbotAnalytics() {
	const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	// Track analytics events
	const trackEvent = (event: AnalyticsEvent) => {
		try {
			// Store in localStorage for demo purposes
			const existingEvents = JSON.parse(localStorage.getItem('chatbot_analytics') || '[]');
			existingEvents.push(event);
			localStorage.setItem('chatbot_analytics', JSON.stringify(existingEvents));

			// In production, you'd send this to your analytics service
			console.log('📊 Analytics Event:', event);
		} catch (error) {
			console.error('Failed to track analytics event:', error);
		}
	};

	// Calculate analytics from stored events
	const calculateAnalytics = (): ChatbotAnalytics => {
		try {
			const events: AnalyticsEvent[] = JSON.parse(
				localStorage.getItem('chatbot_analytics') || '[]',
			);

			const conversations = events.filter((e) => e.type === 'conversation_start').length;
			const messages = events.filter((e) => e.type === 'message_sent').length;
			const intents = events.filter((e) => e.type === 'intent_detected').map((e) => e.data.intent);
			const actions = events.filter((e) => e.type === 'action_clicked').map((e) => e.data.action);

			// Count intent frequencies
			const intentCounts: { [key: string]: number } = {};
			intents.forEach((intent) => {
				intentCounts[intent] = (intentCounts[intent] || 0) + 1;
			});

			// Count action frequencies
			const actionCounts: { [key: string]: number } = {};
			actions.forEach((action) => {
				actionCounts[action] = (actionCounts[action] || 0) + 1;
			});

			return {
				totalConversations: conversations,
				totalMessages: messages,
				averageMessagesPerConversation:
					conversations > 0 ? Math.round((messages / conversations) * 10) / 10 : 0,
				mostCommonIntents: Object.entries(intentCounts)
					.map(([intent, count]) => ({ intent, count }))
					.sort((a, b) => b.count - a.count)
					.slice(0, 5),
				popularActions: Object.entries(actionCounts)
					.map(([action, count]) => ({ action, count }))
					.sort((a, b) => b.count - a.count)
					.slice(0, 5),
				conversationDuration: 0, // Would need to track start/end times
				userSatisfaction: 0, // Would need user feedback
			};
		} catch (error) {
			console.error('Failed to calculate analytics:', error);
			return {
				totalConversations: 0,
				totalMessages: 0,
				averageMessagesPerConversation: 0,
				mostCommonIntents: [],
				popularActions: [],
				conversationDuration: 0,
				userSatisfaction: 0,
			};
		}
	};

	useEffect(() => {
		// Calculate analytics on mount
		setAnalytics(calculateAnalytics());

		// Update analytics every 30 seconds
		const interval = setInterval(() => {
			setAnalytics(calculateAnalytics());
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	// Expose tracking function globally for use in Chatbot component
	useEffect(() => {
		(window as any).trackChatbotEvent = trackEvent;
		return () => {
			delete (window as any).trackChatbotEvent;
		};
	}, []);

	if (!isVisible || !analytics) return null;

	return (
		<div className="fixed left-4 top-4 z-[10000] max-w-sm rounded-lg border border-stone-200 bg-white p-4 shadow-lg dark:border-stone-700 dark:bg-stone-800">
			<div className="mb-3 flex items-center justify-between">
				<h3 className="text-sm font-semibold">Chatbot Analytics</h3>
				<button
					onClick={() => setIsVisible(false)}
					className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
				>
					✕
				</button>
			</div>

			<div className="space-y-3 text-xs">
				<div className="grid grid-cols-2 gap-2">
					<div className="rounded bg-stone-50 p-2 dark:bg-stone-700">
						<div className="font-medium">{analytics.totalConversations}</div>
						<div className="text-stone-500">Conversations</div>
					</div>
					<div className="rounded bg-stone-50 p-2 dark:bg-stone-700">
						<div className="font-medium">{analytics.totalMessages}</div>
						<div className="text-stone-500">Messages</div>
					</div>
				</div>

				<div className="rounded bg-stone-50 p-2 dark:bg-stone-700">
					<div className="font-medium">{analytics.averageMessagesPerConversation}</div>
					<div className="text-stone-500">Avg Messages/Conversation</div>
				</div>

				{analytics.mostCommonIntents.length > 0 && (
					<div>
						<div className="mb-1 font-medium">Top Intents</div>
						<div className="space-y-1">
							{analytics.mostCommonIntents.map(({ intent, count }) => (
								<div key={intent} className="flex justify-between">
									<span className="capitalize">{intent}</span>
									<span className="text-stone-500">{count}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{analytics.popularActions.length > 0 && (
					<div>
						<div className="mb-1 font-medium">Popular Actions</div>
						<div className="space-y-1">
							{analytics.popularActions.map(({ action, count }) => (
								<div key={action} className="flex justify-between">
									<span>{action}</span>
									<span className="text-stone-500">{count}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

// Helper functions to track events from other components
export const trackConversationStart = () => {
	if ((window as any).trackChatbotEvent) {
		(window as any).trackChatbotEvent({
			type: 'conversation_start',
			data: { timestamp: new Date().toISOString() },
			timestamp: new Date().toISOString(),
		});
	}
};

export const trackMessageSent = (message: string) => {
	if ((window as any).trackChatbotEvent) {
		(window as any).trackChatbotEvent({
			type: 'message_sent',
			data: { message },
			timestamp: new Date().toISOString(),
		});
	}
};

export const trackIntentDetected = (intent: string) => {
	if ((window as any).trackChatbotEvent) {
		(window as any).trackChatbotEvent({
			type: 'intent_detected',
			data: { intent },
			timestamp: new Date().toISOString(),
		});
	}
};

export const trackActionClicked = (action: string) => {
	if ((window as any).trackChatbotEvent) {
		(window as any).trackChatbotEvent({
			type: 'action_clicked',
			data: { action },
			timestamp: new Date().toISOString(),
		});
	}
};

export const trackConversationEnd = (duration: number) => {
	if ((window as any).trackChatbotEvent) {
		(window as any).trackChatbotEvent({
			type: 'conversation_end',
			data: { duration },
			timestamp: new Date().toISOString(),
		});
	}
};
