'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Settings, Clock, AlertCircle } from 'lucide-react'

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">便利サービス</h1>
        <p className="text-gray-600">物流業務を効率化する各種サービスをご利用いただけます</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">サービス準備中</h2>
          <p className="text-gray-600 mb-4">
            便利サービスは現在準備中です。<br />
            近日中にリリース予定です。
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>リリース予定: 2024年2月</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}