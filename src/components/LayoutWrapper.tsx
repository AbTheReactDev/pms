'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { useState } from 'react'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const pathname = usePathname()

  const isAuthPage = pathname === '/auth/signin' || pathname === '/auth/signup'

  if (isAuthPage) {
    return <div>{children}</div>
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        } flex-1`}
      >
        <Navbar />
        <main className="p-3">{children}</main>
      </div>
    </div>
  )
}
