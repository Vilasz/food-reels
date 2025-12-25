import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEMO_USER = {
  email: 'demo@foodreels.local',
  username: 'food_reels_demo',
  name: 'Food Reels Demo',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodreels',
}

// Temporary auth shim: try to honor a provided user header; otherwise create/reuse a demo user.
const getOrCreateUserId = async (request: NextRequest) => {
  const headerUserId = request.headers.get('x-user-id')
  if (headerUserId) {
    const existing = await prisma.user.findUnique({ where: { id: headerUserId } })
    if (existing) return existing.id
  }

  const headerEmail = request.headers.get('x-user-email')
  if (headerEmail) {
    const user = await prisma.user.upsert({
      where: { email: headerEmail },
      update: {},
      create: {
        email: headerEmail,
        username: headerEmail.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '_') || 'user',
        name: headerEmail,
      },
    })
    return user.id
  }

  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: {},
    create: DEMO_USER,
  })

  return demoUser.id
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getOrCreateUserId(request)
    const videoId = params.id

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json({ message: 'Already liked' }, { status: 400 })
    }

    // Create like
    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId,
          videoId,
        },
      }),
      prisma.video.update({
        where: { id: videoId },
        data: { likesCount: { increment: 1 } },
      }),
      prisma.analyticsEvent.create({
        data: {
          eventType: 'like',
          userId,
          videoId,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error liking video:', error)
    return NextResponse.json(
      { error: 'Failed to like video' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getOrCreateUserId(request)
    const videoId = params.id

    // Check if liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    })

    if (!existingLike) {
      return NextResponse.json({ message: 'Not liked' }, { status: 400 })
    }

    // Remove like
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
      }),
      prisma.video.update({
        where: { id: videoId },
        data: { likesCount: { decrement: 1 } },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unliking video:', error)
    return NextResponse.json(
      { error: 'Failed to unlike video' },
      { status: 500 }
    )
  }
}

