/**
 * Chatbot Analytics Tracking Module
 * 
 * Tracks user interactions and chatbot performance metrics.
 * Can be integrated with analytics platforms like Google Analytics, Mixpanel, etc.
 */

export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  data?: Record<string, any>;
}

// Session management
let sessionId: string | null = null;
let eventQueue: AnalyticsEvent[] = [];

/**
 * Initialize or retrieve session ID
 */
function getSessionId(): string {
  if (sessionId) return sessionId;
  
  // Check for existing session in sessionStorage
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('chatbot-session-id');
    if (stored) {
      sessionId = stored;
      return sessionId;
    }
  }
  
  // Generate new session ID
  sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('chatbot-session-id', sessionId);
  }
  
  return sessionId;
}

/**
 * Base tracking function that logs events
 */
function trackEvent(eventName: string, data?: Record<string, any>): void {
  const event: AnalyticsEvent = {
    event: eventName,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    data,
  };
  
  eventQueue.push(event);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 [Analytics]', eventName, data);
  }
  
  // Send to analytics platform (can be extended)
  sendToAnalytics(event);
}

/**
 * Send event to analytics platform
 * This can be extended to integrate with Google Analytics, Mixpanel, etc.
 */
function sendToAnalytics(event: AnalyticsEvent): void {
  // Google Analytics 4 integration (if available)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.event, {
      ...event.data,
      session_id: event.sessionId,
      timestamp: event.timestamp,
    });
  }
  
  // Custom analytics endpoint (optional)
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch((error) => {
      console.error('Failed to send analytics:', error);
    });
  }
  
  // Store locally for later analysis (last 100 events)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('chatbot-analytics');
      const events = stored ? JSON.parse(stored) : [];
      events.push(event);
      
      // Keep only last 100 events
      const recentEvents = events.slice(-100);
      localStorage.setItem('chatbot-analytics', JSON.stringify(recentEvents));
    } catch (error) {
      // Ignore localStorage errors
    }
  }
}

/**
 * Track conversation start
 */
export function trackConversationStart(): void {
  trackEvent('chatbot_conversation_start', {
    page_url: typeof window !== 'undefined' ? window.location.href : undefined,
    page_title: typeof window !== 'undefined' ? document.title : undefined,
  });
}

/**
 * Track conversation end
 */
export function trackConversationEnd(duration: number): void {
  trackEvent('chatbot_conversation_end', {
    duration_ms: duration,
    duration_seconds: Math.round(duration / 1000),
  });
}

/**
 * Track message sent by user
 */
export function trackMessageSent(message: string): void {
  trackEvent('chatbot_message_sent', {
    message_length: message.length,
    word_count: message.split(/\s+/).length,
    // Don't log actual message content for privacy
  });
}

/**
 * Track intent detected by AI
 */
export function trackIntentDetected(intent: string): void {
  trackEvent('chatbot_intent_detected', {
    intent,
  });
}

/**
 * Track action clicked (suggested actions, quick replies, etc.)
 */
export function trackActionClicked(actionLabel: string): void {
  trackEvent('chatbot_action_clicked', {
    action_label: actionLabel,
  });
}

/**
 * Track voice feature usage
 */
export function trackVoiceUsage(action: 'enable' | 'disable' | 'speak' | 'listen'): void {
  trackEvent('chatbot_voice_usage', {
    action,
  });
}

/**
 * Track error occurred
 */
export function trackError(errorType: string, errorMessage?: string): void {
  trackEvent('chatbot_error', {
    error_type: errorType,
    error_message: errorMessage,
  });
}

/**
 * Track UI action (calendar modal, contact form, etc.)
 */
export function trackUIAction(actionType: string, actionData?: Record<string, any>): void {
  trackEvent('chatbot_ui_action', {
    action_type: actionType,
    ...actionData,
  });
}

/**
 * Track quick action usage
 */
export function trackQuickAction(actionType: string): void {
  trackEvent('chatbot_quick_action', {
    action_type: actionType,
  });
}

/**
 * Get analytics summary for the current session
 */
export function getSessionAnalytics(): {
  sessionId: string;
  events: AnalyticsEvent[];
  summary: {
    totalEvents: number;
    conversationStarts: number;
    messagesSent: number;
    intentsDetected: number;
    actionsClicked: number;
    errors: number;
  };
} {
  const conversationStarts = eventQueue.filter(e => e.event === 'chatbot_conversation_start').length;
  const messagesSent = eventQueue.filter(e => e.event === 'chatbot_message_sent').length;
  const intentsDetected = eventQueue.filter(e => e.event === 'chatbot_intent_detected').length;
  const actionsClicked = eventQueue.filter(e => e.event === 'chatbot_action_clicked').length;
  const errors = eventQueue.filter(e => e.event === 'chatbot_error').length;
  
  return {
    sessionId: getSessionId(),
    events: [...eventQueue],
    summary: {
      totalEvents: eventQueue.length,
      conversationStarts,
      messagesSent,
      intentsDetected,
      actionsClicked,
      errors,
    },
  };
}

/**
 * Clear analytics data (useful for testing)
 */
export function clearAnalytics(): void {
  eventQueue = [];
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('chatbot-session-id');
    localStorage.removeItem('chatbot-analytics');
  }
  sessionId = null;
}

