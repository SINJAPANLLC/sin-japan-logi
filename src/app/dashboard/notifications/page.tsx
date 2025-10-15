'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Bell, CheckCircle, AlertCircle, Info, X, Filter } from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // サンプル通知データ
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: '荷物マッチング完了',
        message: '荷物ID: #12345 のマッチングが完了しました。',
        timestamp: new Date('2024-01-15T10:30:00'),
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: '新しい荷物が登録されました',
        message: '東京から大阪への荷物が新しく登録されました。',
        timestamp: new Date('2024-01-15T09:15:00'),
        read: false
      },
      {
        id: '3',
        type: 'warning',
        title: '支払い期限のお知らせ',
        message: '請求書 #INV-2024-001 の支払い期限が近づいています。',
        timestamp: new Date('2024-01-14T16:45:00'),
        read: true
      },
      {
        id: '4',
        type: 'error',
        title: 'システムメンテナンスのお知らせ',
        message: '1月20日 2:00-4:00 にシステムメンテナンスを実施します。',
        timestamp: new Date('2024-01-14T14:20:00'),
        read: true
      }
    ]
    
    setNotifications(sampleNotifications)
    setLoading(false)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'error': return 'bg-red-50 border-red-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">通知</h1>
            <p className="text-gray-600">システムからのお知らせを確認できます</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">すべて</option>
                <option value="unread">未読 ({unreadCount})</option>
                <option value="read">既読</option>
              </select>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                すべて既読にする
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            通知一覧 ({filteredNotifications.length}件)
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">読み込み中...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>通知はありません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {notification.timestamp.toLocaleString('ja-JP')}
                        </span>
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        既読にする
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
