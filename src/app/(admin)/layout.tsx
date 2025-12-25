'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import AdminSidebar from '@/app/components/admin/AdminSidebar'

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('accessToken')
    
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const userRole = decoded.role // Backend returns lowercase
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('accessToken')
        router.push('/login')
        return
      }

      // Check if user is admin
      if (userRole !== 'admin') {
        router.push('/')
        return
      }
    } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('accessToken')
      router.push('/login')
    }
  }, [router, isClient])

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null; // Don't render anything on server to avoid mismatch
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
