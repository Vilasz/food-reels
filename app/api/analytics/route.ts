import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      eventType,
      userId,
      videoId,
      foodItemId,
      contentType,
      source,
      metadata,
    } = body

    if (!eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      )
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        userId: userId || null,
        videoId: videoId || null,
        foodItemId: foodItemId || null,
        contentType: contentType || null,
        source: source || null,
        metadata: metadata || null,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating analytics event:', error)
    return NextResponse.json(
      { error: 'Failed to create analytics event' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventType = searchParams.get('eventType')
    const contentType = searchParams.get('contentType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (eventType) {
      where.eventType = eventType
    }

    if (contentType) {
      where.contentType = contentType
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    const events = await prisma.analyticsEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 1000, // Limit for performance
    })

    // Aggregate statistics for A/B testing
    const stats = {
      total: events.length,
      byEventType: {} as Record<string, number>,
      byContentType: {} as Record<string, number>,
      videoVsPhoto: {
        video: {
          views: 0,
          likes: 0,
          clicks: 0,
          purchases: 0,
        },
        photo: {
          views: 0,
          likes: 0,
          clicks: 0,
          purchases: 0,
        },
      },
    }

    events.forEach((event) => {
      // Count by event type
      stats.byEventType[event.eventType] =
        (stats.byEventType[event.eventType] || 0) + 1

      // Count by content type
      if (event.contentType) {
        stats.byContentType[event.contentType] =
          (stats.byContentType[event.contentType] || 0) + 1

        // A/B testing stats
        const contentType = event.contentType.toLowerCase()
        if (contentType === 'video' || contentType === 'photo') {
          const key = contentType as 'video' | 'photo'
          if (event.eventType === 'view') stats.videoVsPhoto[key].views++
          if (event.eventType === 'like') stats.videoVsPhoto[key].likes++
          if (event.eventType === 'click_food_link')
            stats.videoVsPhoto[key].clicks++
          if (event.eventType === 'purchase')
            stats.videoVsPhoto[key].purchases++
        }
      }
    })

    return NextResponse.json({
      events,
      stats,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

