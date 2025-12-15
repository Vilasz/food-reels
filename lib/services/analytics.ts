/**
 * Analytics Service
 * Handles tracking events for A/B testing and user behavior analysis
 */

export type EventType =
  | 'view'
  | 'view_complete'
  | 'like'
  | 'comment'
  | 'share'
  | 'click_food_link'
  | 'purchase'
  | 'scroll'
  | 'pause'
  | 'resume'

export interface AnalyticsEvent {
  eventType: EventType
  userId?: string
  videoId?: string
  foodItemId?: string
  contentType?: 'video' | 'photo'
  source?: string
  metadata?: Record<string, any>
}

/**
 * Track an analytics event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error('Error tracking event:', error)
    // In production, you might want to queue failed events for retry
  }
}

/**
 * Track video view
 */
export async function trackVideoView(
  videoId: string,
  contentType: 'video' | 'photo',
  userId?: string
): Promise<void> {
  await trackEvent({
    eventType: 'view',
    videoId,
    contentType,
    userId,
  })
}

/**
 * Track video completion
 */
export async function trackVideoComplete(
  videoId: string,
  contentType: 'video' | 'photo',
  watchedDuration?: number,
  userId?: string
): Promise<void> {
  await trackEvent({
    eventType: 'view_complete',
    videoId,
    contentType,
    userId,
    metadata: {
      watchedDuration,
    },
  })
}

/**
 * Track marketplace click
 */
export async function trackMarketplaceClick(
  foodItemId: string,
  marketplace: string,
  videoId?: string,
  userId?: string
): Promise<void> {
  await trackEvent({
    eventType: 'click_food_link',
    foodItemId,
    videoId,
    source: marketplace,
    userId,
  })
}

/**
 * Get A/B testing statistics
 */
export async function getABTestStats(
  startDate?: Date,
  endDate?: Date
): Promise<{
  video: {
    views: number
    likes: number
    clicks: number
    purchases: number
    conversionRate: number
  }
  photo: {
    views: number
    likes: number
    clicks: number
    purchases: number
    conversionRate: number
  }
}> {
  try {
    const params = new URLSearchParams()
    if (startDate) params.set('startDate', startDate.toISOString())
    if (endDate) params.set('endDate', endDate.toISOString())

    const response = await fetch(`/api/analytics?${params.toString()}`)
    const data = await response.json()

    const video = data.stats?.videoVsPhoto?.video || {
      views: 0,
      likes: 0,
      clicks: 0,
      purchases: 0,
    }

    const photo = data.stats?.videoVsPhoto?.photo || {
      views: 0,
      likes: 0,
      clicks: 0,
      purchases: 0,
    }

    return {
      video: {
        ...video,
        conversionRate:
          video.views > 0 ? (video.clicks / video.views) * 100 : 0,
      },
      photo: {
        ...photo,
        conversionRate:
          photo.views > 0 ? (photo.clicks / photo.views) * 100 : 0,
      },
    }
  } catch (error) {
    console.error('Error fetching A/B test stats:', error)
    return {
      video: { views: 0, likes: 0, clicks: 0, purchases: 0, conversionRate: 0 },
      photo: { views: 0, likes: 0, clicks: 0, purchases: 0, conversionRate: 0 },
    }
  }
}

