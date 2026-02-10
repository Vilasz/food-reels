import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'RESTAURANT') {
      return NextResponse.json(
        { error: 'Only restaurants can upload videos' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('video') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'File must be a video' },
        { status: 400 }
      )
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Video file must be less than 100MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // Check if we're in production with Vercel Blob configured
    const useVercelBlob = process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV === 'production'

    let videoUrl: string

    if (useVercelBlob) {
      // Production: Upload to Vercel Blob
      const blobPath = `videos/${session.user.id}/${filename}`
      const blob = await put(blobPath, file, {
        access: 'public',
        addRandomSuffix: false,
      })
      videoUrl = blob.url
    } else {
      // Development: Save to local public folder
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create directories if they don't exist
      const uploadDir = path.join(process.cwd(), 'public', 'videos', 'uploads')
      await mkdir(uploadDir, { recursive: true })

      // Save file
      const filePath = path.join(uploadDir, filename)
      await writeFile(filePath, buffer)

      // Return relative URL
      videoUrl = `/videos/uploads/${filename}`
    }

    return NextResponse.json({
      url: videoUrl,
      filename: filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    )
  }
}

// For Next.js 14 App Router - configure route segment
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

