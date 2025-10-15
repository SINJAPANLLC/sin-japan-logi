'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  Store, 
  Banknote, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Shield,
  Download,
  QrCode,
  Calendar,
  DollarSign,
  FileText,
  ArrowRight
} from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  icon: any
  description: string
  processingTime: string
  fee: string
  isAvailable: boolean
  isRecommended?: boolean
}

interface PaymentHistory {
  id: string
  date: string
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed'
  description: string
}

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const userProfile = JSON.parse(userData)
      setUser(userProfile)
    }

    // サンプルデータ
    setPaymentHistory([
      {
        id: '1',
        date: '2024-01-15',
        amount: 50000,
        method: 'クレジットカード',
        status: 'completed',
        description: '月額利用料金'
      },
      {
        id: '2',
        date: '2024-01-10',
        amount: 25000,
        method: '銀行振込',
        status: 'completed',
        description: '追加サービス料金'
      },
      {
        id: '3',
        date: '2024-01-05',
        amount: 15000,
        method: 'コンビニ払い',
        status: 'pending',
        description: 'AI検索利用料金'
      }
    ])
  }, [])

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'クレジットカード決済',
      icon: CreditCard,
      description: 'Visa、Mastercard、JCB、AMEX対応',
      processingTime: '即時',
      fee: '3.6%',
      isAvailable: true,
      isRecommended: true
    },
    {
      id: 'bank-transfer',
      name: '銀行振込',
      icon: Building2,
      description: '銀行口座からの振込',
      processingTime: '1-3営業日',
      fee: '無料',
      isAvailable: true
    },
    {
      id: 'account-transfer',
      name: '口座振替',
      icon: Banknote,
      description: '登録口座からの自動振替',
      processingTime: '即時',
      fee: '無料',
      isAvailable: true
    },
    {
      id: 'digital-wallet',
      name: '電子マネー',
      icon: Smartphone,
      description: 'PayPay、LINE Pay、楽天Pay対応',
      processingTime: '即時',
      fee: '2.5%',
      isAvailable: true
    },
    {
      id: 'convenience',
      name: 'コンビニ払い',
      icon: Store,
      description: '全国のコンビニエンスストアで支払い可能',
      processingTime: '即時',
      fee: '200円',
      isAvailable: true
    }
  ]

  const handlePayment = () => {
    if (!selectedMethod || !amount) {
      alert('決済方法と金額を選択してください')
      return
    }

    const method = paymentMethods.find(m => m.id === selectedMethod)
    if (method) {
      alert(`${method.name}で${parseInt(amount).toLocaleString()}円の決済を開始します`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '完了'
      case 'pending': return '処理中'
      case 'failed': return '失敗'
      default: return '不明'
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">お支払い</h1>
        <p className="text-gray-600">各種決済方法でお支払いいただけます</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 決済方法選択 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 決済金額入力 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                決済金額
              </h2>
            </div>
            <div className="p-6">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  支払い金額
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">円</span>
                </div>
              </div>
            </div>
          </div>

          {/* 決済方法一覧 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">決済方法を選択</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon
                  return (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            method.isRecommended ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{method.name}</h3>
                              {method.isRecommended && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  おすすめ
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{method.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {method.processingTime}
                              </span>
                              <span className="text-xs text-gray-500">
                                手数料: {method.fee}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {selectedMethod === method.id ? (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6">
                <button
                  onClick={handlePayment}
                  disabled={!selectedMethod || !amount}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Shield className="h-5 w-5" />
                  <span>決済を実行</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 支払い履歴 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                支払い履歴
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        ¥{payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{payment.method}</p>
                      <p className="text-xs text-gray-500">{payment.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{payment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm">
                すべて表示
              </button>
            </div>
          </div>

          {/* 請求書ダウンロード */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">請求書</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Download className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">2024年1月請求書</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Download className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">2023年12月請求書</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* セキュリティ情報 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">セキュリティ</h3>
                <p className="text-sm text-green-700 mt-1">
                  すべての決済はSSL暗号化により保護されています。
                  お客様の情報は安全に処理されます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
