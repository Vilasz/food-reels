import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // TODO: Send email with reset link
    // For now, we'll just return success
    console.log(`Reset token for ${email}: ${resetToken}`)

    return NextResponse.json(
      { message: 'If an account with that email exists, a reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

