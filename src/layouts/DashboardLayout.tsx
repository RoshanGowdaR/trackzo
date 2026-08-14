'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import {
  Menu,
  X,
  LogOut,
  Home,
  Briefcase,
  Users,
  Calculator,
  Package,
  ShoppingCart,
  TrendingUp,
  FileText,
  Calendar,
  Bell,
  Settings,
  Building2,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Briefcase, label: 'Projects', href: '/projects' },
  { icon: Users, label: 'Clients', href: '/clients' },
  { icon: Calculator, label: 'Estimation', href: '/estimation' },
  { icon: Package, label: 'Materials', href: '/materials' },
  { icon: ShoppingCart, label: 'Purchase', href: '/purchase' },
  { icon: TrendingUp, label: 'Finance', href: '/finance' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Building2, label: 'Account Tracker', href: '/account-tracker' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Auto-login user if not logged in (for development)
  useEffect(() => {
    setMounted(true)
    if (!user) {
      const defaultUser = { id: '1', name: 'Super Admin', email: 'admin@buildflow.com', role: 'super_admin' as const, createdAt: new Date() }
      useAuthStore.setState({ user: defaultUser })
    }
    setIsLoading(false)
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)',
      }}
    >
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={isMobile ? { x: -320 } : { x: 0 }}
        animate={isMobile ? { x: sidebarOpen ? 0 : -320 } : { x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-80 bg-secondary-900/80 border-r border-white/10 z-50 md:static md:translate-x-0 flex flex-col backdrop-blur-xl"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BuildFlow</h1>
              <p className="text-xs text-secondary-400">ERP System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
                    active
                      ? 'bg-primary-600/20 text-primary-400 border-l-2 border-primary-600'
                      : 'text-secondary-300 hover:bg-secondary-800/50 hover:text-white border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          {user && !isLoading ? (
            <>
              <div
                className="rounded-lg p-4 mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-secondary-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
              <motion.button
                suppressHydrationWarning
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-secondary-300 hover:text-white hover:bg-secondary-800/50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-secondary-400 text-sm">Loading...</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Navigation */}
        <div
          className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl"
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center justify-between p-4 md:p-6">
            <motion.button
              suppressHydrationWarning
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-secondary-800/50 rounded-lg text-secondary-300 hover:text-white transition-all md:hidden"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>

            <div className="flex-1" />

            <div className="flex items-center gap-4">
              <motion.button
                suppressHydrationWarning
                whileHover={{ scale: 1.1 }}
                className="relative p-2 hover:bg-secondary-800/50 rounded-lg text-secondary-300 hover:text-white transition-all"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              <motion.button
                suppressHydrationWarning
                whileHover={{ scale: 1.1 }}
                onClick={handleLogout}
                className="p-2 hover:bg-secondary-800/50 rounded-lg text-secondary-300 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
