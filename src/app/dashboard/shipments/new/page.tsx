'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Package, 
  MapPin, 
  Calendar, 
  Weight, 
  Truck, 
  DollarSign, 
  Save, 
  X,
  Plus
} from 'lucide-react'

export default function NewShipmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cargoName: '',
    cargoDescription: '',
    cargoWeight: '',
    cargoVolume: '',
    pickupPrefecture: '',
    pickupCity: '',
    pickupAddress: '',
    pickupDate: '',
    pickupTimeFrom: '',
    pickupTimeTo: '',
    deliveryPrefecture: '',
    deliveryCity: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTimeFrom: '',
    deliveryTimeTo: '',
    requiredVehicleType: '',
    budget: '',
    specialRequirements: ''
  })

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  const vehicleTypes = [
    '軽トラック', '小型トラック', '中型トラック', '大型トラック', 'トレーラー', '冷凍車', '冷蔵車', 'その他'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          cargoWeight: parseFloat(formData.cargoWeight),
          cargoVolume: formData.cargoVolume ? parseFloat(formData.cargoVolume) : null,
          budget: parseFloat(formData.budget),
          pickupDate: new Date(formData.pickupDate),
          deliveryDate: new Date(formData.deliveryDate)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create shipment')
      }

      alert('荷物が正常に登録されました！')
      router.push('/dashboard/my-shipments')
    } catch (error) {
      console.error('Error creating shipment:', error)
      alert('荷物の登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">荷物登録</h1>
        <p className="text-gray-600">新しい荷物を登録してください</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            基本情報
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">荷物名 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.cargoName}
                onChange={(e) => handleInputChange('cargoName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="荷物名を入力してください"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">荷物説明</label>
              <textarea
                value={formData.cargoDescription}
                onChange={(e) => handleInputChange('cargoDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="荷物の詳細を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">重量 (kg) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={formData.cargoWeight}
                onChange={(e) => handleInputChange('cargoWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 1000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">容積 (m³)</label>
              <input
                type="number"
                value={formData.cargoVolume}
                onChange={(e) => handleInputChange('cargoVolume', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 10"
              />
            </div>
          </div>
        </div>

        {/* 出発地情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            出発地情報
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">都道府県 <span className="text-red-500">*</span></label>
              <select
                value={formData.pickupPrefecture}
                onChange={(e) => handleInputChange('pickupPrefecture', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                {prefectures.map(pref => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">市区町村 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.pickupCity}
                onChange={(e) => handleInputChange('pickupCity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="市区町村を入力してください"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
              <input
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="詳細住所を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">出発日 <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">出発時間</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={formData.pickupTimeFrom}
                  onChange={(e) => handleInputChange('pickupTimeFrom', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="flex items-center text-gray-500">〜</span>
                <input
                  type="time"
                  value={formData.pickupTimeTo}
                  onChange={(e) => handleInputChange('pickupTimeTo', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 到着地情報 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            到着地情報
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">都道府県 <span className="text-red-500">*</span></label>
              <select
                value={formData.deliveryPrefecture}
                onChange={(e) => handleInputChange('deliveryPrefecture', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                {prefectures.map(pref => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">市区町村 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.deliveryCity}
                onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="市区町村を入力してください"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
              <input
                type="text"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="詳細住所を入力してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">到着日 <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">到着時間</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={formData.deliveryTimeFrom}
                  onChange={(e) => handleInputChange('deliveryTimeFrom', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="flex items-center text-gray-500">〜</span>
                <input
                  type="time"
                  value={formData.deliveryTimeTo}
                  onChange={(e) => handleInputChange('deliveryTimeTo', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 輸送条件 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            輸送条件
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">必要車両タイプ <span className="text-red-500">*</span></label>
              <select
                value={formData.requiredVehicleType}
                onChange={(e) => handleInputChange('requiredVehicleType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">予算 (円) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 50000"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">特別な要件</label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="温度管理、危険物、その他特別な要件があれば入力してください"
              />
            </div>
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/my-shipments')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>キャンセル</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? '登録中...' : '荷物を登録'}</span>
          </button>
        </div>
      </form>
    </DashboardLayout>
  )
}