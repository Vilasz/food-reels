'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX,
  FiBriefcase,
  FiSettings,
  FiHeart,
  FiTrendingUp
} from 'react-icons/fi'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const toggleSidebar = () => setIsOpen(!isOpen)

  const isActive = (path: string) => pathname === path

  const handleSignOut = () => {
    signOut({ callbackUrl: '/feed' })
  }

  const menuItems = session?.user ? (
    session.user.role === 'RESTAURANT' ? [
      { icon: FiHome, label: 'Feed', path: '/feed' },
      { icon: FiBriefcase, label: 'Dashboard', path: '/dashboard/restaurant' },
      { icon: FiSettings, label: 'Profile', path: '/profile' },
    ] : [
      { icon: FiHome, label: 'Feed', path: '/feed' },
      { icon: FiHeart, label: 'Liked', path: '/liked' },
      { icon: FiUser, label: 'Profile', path: '/profile' },
    ]
  ) : [
    { icon: FiHome, label: 'Feed', path: '/feed' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FiX className="w-6 h-6 text-gray-700" />
        ) : (
          <FiMenu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop always visible, Mobile toggle */}
      <aside className={`fixed left-0 top-0 h-screen w-72 bg-white shadow-2xl z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-200">
              <Link href="/feed" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">FR</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Food Reels</h1>
                  <p className="text-xs text-gray-500">Discover Food</p>
                </div>
              </Link>
            </div>

            {/* User Info */}
            {session?.user && (
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {session.user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{session.user.username}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                      {session.user.role === 'RESTAURANT' ? 'Restaurant' : 'User'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Auth Actions */}
            <div className="p-4 border-t border-gray-200">
              {session?.user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-medium"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
                  >
                    <FiLogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg transition-all font-medium"
                  >
                    <FiUser className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </aside>
    </>
  )
}

