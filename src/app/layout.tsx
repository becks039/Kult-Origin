'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { CartProvider } from '@/context/CartContext'
import VapiResponder from '@/components/VapiResponder'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Detect if current path belongs to Payload Admin panel
  const isAdminRoute = pathname?.startsWith('/admin')

  // Render children directly without nesting <html> and <body> tags for admin routes
  if (isAdminRoute) {
    return <>{children}</>
  }

  // Render standard HTML wrapper with Global Cart Provider & Vapi Responder for user-facing routes
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <VapiResponder />
        </CartProvider>
      </body>
    </html>
  )
}