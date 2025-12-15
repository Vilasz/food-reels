import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const where: any = {}

    if (category) {
      where.category = category
    }

    if (tag) {
      where.tags = {
        has: tag,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { restaurantName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const foodItems = await prisma.foodItem.findMany({
      where,
      include: {
        video: {
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(foodItems)
  } catch (error) {
    console.error('Error fetching food items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch food items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      price,
      currency = 'BRL',
      imageUrl,
      ifoodUrl,
      storeUrl,
      restaurantName,
      location,
      category,
      tags = [],
      otherMarketplaceUrls,
    } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const foodItem = await prisma.foodItem.create({
      data: {
        name,
        description,
        price,
        currency,
        imageUrl,
        ifoodUrl,
        storeUrl,
        restaurantName,
        location,
        category,
        tags,
        otherMarketplaceUrls: otherMarketplaceUrls || null,
      },
    })

    return NextResponse.json(foodItem, { status: 201 })
  } catch (error) {
    console.error('Error creating food item:', error)
    return NextResponse.json(
      { error: 'Failed to create food item' },
      { status: 500 }
    )
  }
}

