/**
 * Rate limiting middleware for API routes
 * Simple in-memory rate limiter (use Redis for production)
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  max: number // Maximum requests per window
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max } = options

  return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now()
    const key = identifier

    if (!store[key] || store[key].resetTime < now) {
      // Create new window
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      }
      return {
        allowed: true,
        remaining: max - 1,
        resetTime: store[key].resetTime,
      }
    }

    if (store[key].count >= max) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: store[key].resetTime,
      }
    }

    store[key].count++
    return {
      allowed: true,
      remaining: max - store[key].count,
      resetTime: store[key].resetTime,
    }
  }
}

// Clean up old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  }, 60000) // Clean up every minute
}

