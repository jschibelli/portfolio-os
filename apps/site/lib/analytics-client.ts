/**
 * Client-side Analytics Tracking
 * 
 * Tracks real user interactions and sends them to the server
 */

interface TrackingEvent {
  type: 'page_view' | 'user_interaction'
  data: any
}

class AnalyticsClient {
  private sessionId: string
  private userId?: string
  private isTracking: boolean = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return

    // Start tracking on page load
    this.trackPageView()
    
    // Track user interactions
    this.setupInteractionTracking()
    
    // Track session end
    this.setupSessionTracking()
  }

  private trackPageView(): void {
    if (typeof window === 'undefined') return

    const pageData = {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    this.sendEvent('page_view', pageData)
  }

  private setupInteractionTracking(): void {
    if (typeof window === 'undefined') return

    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target) {
        this.trackUserInteraction({
          type: 'click',
          element: target.tagName.toLowerCase(),
          value: {
            id: target.id,
            className: target.className,
            text: target.textContent?.slice(0, 100)
          },
          timestamp: new Date(),
          sessionId: this.sessionId,
          userId: this.userId,
          pageUrl: window.location.href
        })
      }
    })

    // Track scroll depth
    let maxScroll = 0
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        
        this.trackUserInteraction({
          type: 'scroll',
          element: 'page',
          value: { depth: scrollPercent },
          timestamp: new Date(),
          sessionId: this.sessionId,
          userId: this.userId,
          pageUrl: window.location.href
        })
      }
    })

    // Track time on page
    let startTime = Date.now()
    setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      
      if (timeOnPage > 0 && timeOnPage % 30 === 0) { // Track every 30 seconds
        this.trackUserInteraction({
          type: 'time_on_page',
          element: 'page',
          value: { seconds: timeOnPage },
          timestamp: new Date(),
          sessionId: this.sessionId,
          userId: this.userId,
          pageUrl: window.location.href
        })
      }
    }, 1000)

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.trackUserInteraction({
        type: 'form_submit',
        element: form.tagName.toLowerCase(),
        value: {
          id: form.id,
          className: form.className,
          action: form.action
        },
        timestamp: new Date(),
        sessionId: this.sessionId,
        userId: this.userId,
        pageUrl: window.location.href
      })
    })

    // Track downloads
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      
      if (link && this.isDownloadLink(link.href)) {
        this.trackUserInteraction({
          type: 'download',
          element: 'a',
          value: {
            href: link.href,
            text: link.textContent?.slice(0, 100)
          },
          timestamp: new Date(),
          sessionId: this.sessionId,
          userId: this.userId,
          pageUrl: window.location.href
        })
      }
    })
  }

  private setupSessionTracking(): void {
    if (typeof window === 'undefined') return

    // Track session start
    this.startSession()

    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.endSession()
    })

    // Track session end on visibility change (mobile)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.endSession()
      }
    })
  }

  private isDownloadLink(href: string): boolean {
    const downloadExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.tar', '.gz']
    return downloadExtensions.some(ext => href.toLowerCase().includes(ext))
  }

  private trackUserInteraction(interaction: any): void {
    this.sendEvent('user_interaction', interaction)
  }

  private startSession(): void {
    const sessionData = {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: new Date(),
      pageViews: 1,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    }

    this.sendEvent('session_start', sessionData)
  }

  private endSession(): void {
    this.sendEvent('session_end', {
      sessionId: this.sessionId,
      endTime: new Date()
    })
  }

  private sendEvent(type: string, data: any): void {
    if (!this.isTracking) return

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString()
      })
    }).catch(error => {
      console.warn('Failed to send analytics event:', error)
    })
  }

  public setUserId(userId: string): void {
    this.userId = userId
  }

  public startTracking(): void {
    this.isTracking = true
  }

  public stopTracking(): void {
    this.isTracking = false
  }
}

// Create global analytics instance
const analytics = new AnalyticsClient()

// Start tracking automatically
analytics.startTracking()

export default analytics
