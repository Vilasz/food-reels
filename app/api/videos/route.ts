import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const contentType = searchParams.get('contentType')
    const my = searchParams.get('my') === 'true'
    const skip = (page - 1) * limit

    const where: any = {
      isActive: true,
    }

    if (contentType) {
      where.contentType = contentType
    }

    // Filter by current user's videos
    if (my && session?.user?.id) {
      where.creatorId = session.user.id
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true,
            },
          },
          foodItem: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.video.count({ where }),
    ])

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      foodItemId,
      contentType = 'video',
    } = body

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration,
        creatorId: session.user.id,
        foodItemId: foodItemId || null,
        contentType,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        foodItem: true,
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}

