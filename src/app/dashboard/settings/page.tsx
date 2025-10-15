'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  Building2, 
  User, 
  CreditCard, 
  FileText, 
  Mail, 
  DollarSign,
  Users,
  Bell,
  LogOut,
  Save,
  X,
  Edit
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('基本情報')
  const [expandedSections, setExpandedSections] = useState({
    '企業情報管理': true,
    'ユーザー管理': false
  })
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    contactPerson: '',
    email: '',
    phone: '',
    companyName: '',
    postalCode: '',
    address: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const userProfile = JSON.parse(userData)
      setUser(userProfile)
      setFormData({
        contactPerson: userProfile.contactPerson || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        companyName: userProfile.companyName || '',
        postalCode: userProfile.postalCode || '',
        address: userProfile.address || ''
      })
    }
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }))
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    if (user) {
      setFormData({
        contactPerson: user.contactPerson || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        postalCode: user.postalCode || '',
        address: user.address || ''
      })
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = { ...user, ...formData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('プロフィールの更新に失敗しました')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const menuItems = [
    {
      section: '企業情報管理',
      icon: Building2,
      items: [
        { id: '基本情報', label: '基本情報' },
        { id: '詳細情報', label: '詳細情報' },
        { id: '信用情報', label: '信用情報' },
        { id: '契約内容', label: '契約内容' },
        { id: '口座情報', label: '口座情報' },
        { id: 'お支払い方法', label: 'お支払い方法' },
        { id: '請求書受領設定', label: '請求書受領設定' },
        { id: '請求書発行設定', label: '請求書発行設定' },
        { id: '経理担当者', label: '経理担当者' }
      ]
    },
    {
      section: 'ユーザー管理',
      icon: Users,
      items: [
        { id: 'メール受信設定', label: 'メール受信設定' },
        { id: 'ご利用金額', label: 'ご利用金額' },
        { id: 'ログアウト', label: 'ログアウト', isLogout: true }
      ]
    }
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600">アカウント設定を管理できます</p>
      </div>

      <div className="flex gap-6">
        {/* サイドメニュー */}
        <div className="w-64 bg-white rounded-lg shadow-sm border">
          <div className="p-4">
            {menuItems.map((section) => (
              <div key={section.section} className="mb-4">
                <button
                  onClick={() => toggleSection(section.section)}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <section.icon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="font-medium text-gray-900">{section.section}</span>
                  </div>
                  {expandedSections[section.section as keyof typeof expandedSections] ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                
                {expandedSections[section.section as keyof typeof expandedSections] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.isLogout) {
                            handleLogout()
                          } else {
                            setActiveSection(item.id)
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === item.id
                            ? 'bg-green-50 text-green-800 border-r-2 border-green-600'
                            : item.isLogout
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.isLogout && <LogOut className="h-4 w-4 inline mr-2" />}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">{activeSection}</h2>
              {activeSection === '基本情報' && (
                <div className="flex space-x-2">
                  {editing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>保存</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>キャンセル</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>編集</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {activeSection === '基本情報' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">会社名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="会社名を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.companyName || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">担当者名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="担当者名を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.contactPerson || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="メールアドレスを入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="電話番号を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.phone || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">郵便番号</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="郵便番号を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.postalCode || '未設定'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
                  {editing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="住所を入力してください"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.address || '未設定'}</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === '詳細情報' && (
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">詳細情報の設定ページに移動します</p>
                <button
                  onClick={() => router.push('/dashboard/settings/company-details')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  詳細情報を設定
                </button>
              </div>
            )}

            {activeSection === '信用情報' && (
              <div className="text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">信用情報の確認ページに移動します</p>
                <button
                  onClick={() => router.push('/dashboard/settings/credit-info')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  信用情報を確認
                </button>
              </div>
            )}

            {activeSection === '契約内容' && (
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">契約内容の管理ページに移動します</p>
                <button
                  onClick={() => router.push('/dashboard/settings/contract')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  契約内容を管理
                </button>
              </div>
            )}

            {activeSection === '口座情報' && (
              <div className="text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">口座情報の管理ページに移動します</p>
                <button
                  onClick={() => router.push('/dashboard/settings/account-info')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  口座情報を管理
                </button>
              </div>
            )}

            {activeSection === 'お支払い方法' && (
              <div className="text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">お支払い方法の設定ページに移動します</p>
                <button
                  onClick={() => router.push('/dashboard/payment')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  お支払い方法を設定
                </button>
              </div>
            )}

            {activeSection === '請求書受領設定' && (
              <div className="text-center text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>請求書受領設定は準備中です</p>
              </div>
            )}

            {activeSection === '請求書発行設定' && (
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>請求書発行設定は準備中です</p>
              </div>
            )}

            {activeSection === '経理担当者' && (
              <div className="text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>経理担当者の設定は準備中です</p>
              </div>
            )}

            {activeSection === 'メール受信設定' && (
              <div className="text-center text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>メール受信設定は準備中です</p>
              </div>
            )}

            {activeSection === 'ご利用金額' && (
              <div className="text-center text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>ご利用金額の確認は準備中です</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}