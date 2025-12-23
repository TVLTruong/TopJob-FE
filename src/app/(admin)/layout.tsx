'use client'

import React, { useEffect } from 'react'
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

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const userRole = (decoded.role || '').toString().toUpperCase()
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('access_token')
        router.push('/login')
        return
      }

      // Check if user is admin
      if (userRole !== 'ADMIN') {
        router.push('/')
        return
      }
    } catch (error) {
      console.error('Invalid token:', error)
      localStorage.removeItem('access_token')
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
