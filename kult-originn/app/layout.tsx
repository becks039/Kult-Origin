'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import './globals.css' // CSS file ka sahi path ensure kar lein

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Check karein ke request Payload Admin page (/admin) ke liye toh nahi hai
  const isAdminRoute = pathname?.startsWith('/admin')

  // Agar Admin page hai, toh extra html/body render mat karo
  if (isAdminRoute) {
    return <>{children}</>
  }

  // Frontend pages ke liye normal HTML wrapper
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}