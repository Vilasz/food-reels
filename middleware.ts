export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/api/videos/:path*',
    '/api/food-items/:path*'
  ]
}

