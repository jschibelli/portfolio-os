'use client'

import { useEffect } from 'react'
import analytics from '@/lib/analytics-client'

export default function AnalyticsTracker() {
  useEffect(() => {
    // Analytics tracking is automatically initialized in the client
    // This component just ensures the tracking starts
    analytics.startTracking()
  }, [])

  return null // This component doesn't render anything
}