'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import StatsDisplay from '@/components/StatsDisplay'
import { Bell, User, User as UserIcon } from 'lucide-react'

interface DashboardHeaderProps {
  user?: any
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <StatsDisplay />
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-800"
          >
            ダッシュボード
          </button>
          <button 
            onClick={() => router.push('/contact')}
            className="text-gray-600 hover:text-gray-800"
          >
            お問い合わせ
          </button>
          <button 
            onClick={() => router.push('/dashboard/notifications')}
            className="relative"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <div 
            onClick={() => router.push('/dashboard/profile')}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg px-2 py-1"
          >
            <User className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="h-4 w-4" />
            </User>
            <span className="text-gray-700">{user?.contactPerson}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
