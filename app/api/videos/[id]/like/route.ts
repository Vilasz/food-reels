import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// For demo purposes, using a default user ID
// In production, get from authentication
const getUserId = () => {
  // TODO: Get from session/auth
  return 'demo-user-id'
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId()
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
    const userId = getUserId()
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

