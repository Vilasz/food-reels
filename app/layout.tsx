import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/lib/providers/SessionProvider'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Food Reels - Discover Food Through Videos',
  description: 'TikTok-like food discovery platform connecting to iFood and stores',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider session={null}>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-72">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}

