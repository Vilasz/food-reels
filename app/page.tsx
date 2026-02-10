'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/feed')
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <div className="text-white text-xl">Loading...</div>
      </div>
    </div>
  )
}

