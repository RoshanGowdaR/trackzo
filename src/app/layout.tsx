import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], fallback: ['system-ui', 'sans-serif'] })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'BuildFlow ERP - Construction Management System',
  description: 'Premium enterprise construction ERP and project estimation system',
  authors: [{ name: 'BuildFlow' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning style={{ colorScheme: 'dark' }}>
      <body
        suppressHydrationWarning
        className={`${inter.className} overflow-x-hidden`}
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
          color: '#f1f5f9',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        }}
      >
        {children}
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  )
}
