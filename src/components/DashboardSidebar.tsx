'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { 
  Package, 
  Search, 
  Truck, 
  Building2, 
  Users, 
  Settings, 
  FileText, 
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Bookmark,
  History,
  Shield
} from 'lucide-react'

export default function DashboardSidebar() {
  const router = useRouter()
  const [shipmentSearchOpen, setShipmentSearchOpen] = useState(false)
  const [myShipmentsOpen, setMyShipmentsOpen] = useState(false)

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* ロゴエリア */}
      <div className="p-6 border-b">
        <Logo linkable={false} />
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {/* 荷物を探す */}
          <div className="space-y-1">
            <button 
              onClick={() => setShipmentSearchOpen(!shipmentSearchOpen)}
              className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center">
                <Search className="h-4 w-4 mr-3" />
                荷物を探す
              </span>
              {shipmentSearchOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {shipmentSearchOpen && (
              <div className="ml-6 space-y-1">
                <button 
                  onClick={() => router.push('/shipments/search')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <Search className="h-4 w-4 mr-3" />
                  荷物検索
                </button>
                <button 
                  onClick={() => router.push('/dashboard/saved-shipments')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <Bookmark className="h-4 w-4 mr-3" />
                  保存した荷物
                </button>
                <button 
                  onClick={() => router.push('/dashboard/recent-shipments')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <History className="h-4 w-4 mr-3" />
                  最近見た荷物
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => router.push('/dashboard/limited-shipments')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Package className="h-4 w-4 mr-3" />
            限定荷物
          </button>

          <button 
            onClick={() => router.push('/dashboard/shipments/new')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-3" />
            荷物登録
          </button>
          
          {/* マイ荷物・成約 */}
          <div className="space-y-1">
            <button 
              onClick={() => setMyShipmentsOpen(!myShipmentsOpen)}
              className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center">
                <Package className="h-4 w-4 mr-3" />
                マイ荷物・成約
              </span>
              {myShipmentsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {myShipmentsOpen && (
              <div className="ml-6 space-y-1">
                <button 
                  onClick={() => router.push('/dashboard/my-shipments')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <Package className="h-4 w-4 mr-3" />
                  登録した荷物
                </button>
                <button 
                  onClick={() => router.push('/dashboard/contracted-shipments')}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center text-sm"
                >
                  <CheckCircle className="h-4 w-4 mr-3" />
                  成約した荷物
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => router.push('/dashboard/vehicle-search')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Truck className="h-4 w-4 mr-3" />
            空車検索
          </button>

          <button 
            onClick={() => router.push('/vehicles/register')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-3" />
            空車登録
          </button>

          <button 
            onClick={() => router.push('/dashboard/company-search')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Building2 className="h-4 w-4 mr-3" />
            企業検索
          </button>

          <button 
            onClick={() => router.push('/dashboard/partners')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Users className="h-4 w-4 mr-3" />
            取引先管理
          </button>

          <button 
            onClick={() => router.push('/dashboard/transport-log')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <FileText className="h-4 w-4 mr-3" />
            実運送体制管理簿
          </button>

          <button 
            onClick={() => router.push('/dashboard/verification')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Shield className="h-4 w-4 mr-3" />
            許可証・認証
          </button>

          <button 
            onClick={() => router.push('/dashboard/services')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Settings className="h-4 w-4 mr-3" />
            便利サービス
          </button>

          <button 
            onClick={() => router.push('/dashboard/settings')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <Settings className="h-4 w-4 mr-3" />
            設定
          </button>
        </div>
      </nav>
    </div>
  )
}
