'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Shield,
  Download,
  Eye,
  X,
  Plus,
  Camera,
  Scan
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'business_license' | 'transport_license' | 'insurance' | 'tax_certificate' | 'other'
  status: 'pending' | 'approved' | 'rejected' | 'not_uploaded'
  uploadedAt?: string
  reviewedAt?: string
  reviewer?: string
  comment?: string
  fileUrl?: string
}

export default function VerificationPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const userProfile = JSON.parse(userData)
      setUser(userProfile)
    }

    // サンプルデータ
    setDocuments([
      {
        id: '1',
        name: '事業許可証',
        type: 'business_license',
        status: 'approved',
        uploadedAt: '2024-01-10',
        reviewedAt: '2024-01-12',
        reviewer: '管理者',
        comment: '承認されました'
      },
      {
        id: '2',
        name: '一般貨物自動車運送事業許可証',
        type: 'transport_license',
        status: 'pending',
        uploadedAt: '2024-01-15',
        comment: '審査中です'
      },
      {
        id: '3',
        name: '保険証券',
        type: 'insurance',
        status: 'not_uploaded'
      },
      {
        id: '4',
        name: '法人番号証明書',
        type: 'tax_certificate',
        status: 'rejected',
        uploadedAt: '2024-01-08',
        reviewedAt: '2024-01-10',
        reviewer: '管理者',
        comment: '画像が不鮮明です。再アップロードしてください。'
      }
    ])
  }, [])

  const documentTypes = [
    { value: 'business_license', label: '事業許可証', required: true },
    { value: 'transport_license', label: '一般貨物自動車運送事業許可証', required: true },
    { value: 'insurance', label: '保険証券', required: true },
    { value: 'tax_certificate', label: '法人番号証明書', required: true },
    { value: 'other', label: 'その他', required: false }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      alert('ファイルと文書タイプを選択してください')
      return
    }

    setUploading(true)
    try {
      // 実際のアップロード処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newDocument: Document = {
        id: Date.now().toString(),
        name: documentTypes.find(t => t.value === selectedDocumentType)?.label || '',
        type: selectedDocumentType as any,
        status: 'pending',
        uploadedAt: new Date().toISOString().split('T')[0]
      }

      setDocuments(prev => prev.map(doc => 
        doc.type === selectedDocumentType ? newDocument : doc
      ))

      setSelectedFile(null)
      setSelectedDocumentType('')
      alert('ファイルがアップロードされました。審査をお待ちください。')
    } catch (error) {
      console.error('Upload error:', error)
      alert('アップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'not_uploaded': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '承認済み'
      case 'pending': return '審査中'
      case 'rejected': return '却下'
      case 'not_uploaded': return '未アップロード'
      default: return '不明'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <X className="h-4 w-4" />
      case 'not_uploaded': return <AlertCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const requiredDocuments = documents.filter(doc => 
    documentTypes.find(t => t.value === doc.type)?.required
  )
  const approvedRequiredDocuments = requiredDocuments.filter(doc => doc.status === 'approved')
  const isFullyVerified = approvedRequiredDocuments.length === requiredDocuments.length

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">許可証・認証</h1>
            <p className="text-gray-600">必要な許可証をアップロードして認証を受けましょう</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className={`h-6 w-6 ${isFullyVerified ? 'text-green-600' : 'text-yellow-600'}`} />
            <span className={`text-sm font-medium ${isFullyVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {isFullyVerified ? '認証完了' : '認証待ち'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* 認証ステータス */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">認証ステータス</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {isFullyVerified ? '認証完了' : '認証待ち'}
                </h3>
                <p className="text-sm text-gray-600">
                  {approvedRequiredDocuments.length} / {requiredDocuments.length} の必須書類が承認されています
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                isFullyVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isFullyVerified ? '認証済み' : '認証待ち'}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(approvedRequiredDocuments.length / requiredDocuments.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 文書一覧 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">必要書類一覧</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        document.status === 'approved' ? 'bg-green-100 text-green-600' :
                        document.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        document.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{document.name}</h3>
                        <p className="text-xs text-gray-500">
                          {documentTypes.find(t => t.value === document.type)?.required ? '必須' : '任意'}
                        </p>
                        {document.uploadedAt && (
                          <p className="text-xs text-gray-500">アップロード日: {document.uploadedAt}</p>
                        )}
                        {document.comment && (
                          <p className="text-xs text-gray-600 mt-1">{document.comment}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        <span>{getStatusText(document.status)}</span>
                      </span>
                      {document.status !== 'not_uploaded' && (
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ファイルアップロード */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">ファイルアップロード</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文書タイプ
                </label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} {type.required ? '(必須)' : '(任意)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ファイル選択
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedFile ? selectedFile.name : 'ファイルを選択またはドラッグ&ドロップ'}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG, DOC, DOCX (最大10MB)
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !selectedDocumentType || uploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>アップロード中...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>アップロード</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">重要事項</h3>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• すべての必須書類が承認されるまで、案件の投稿やマッチングはできません</li>
                <li>• アップロードしたファイルは管理者が審査します（通常1-3営業日）</li>
                <li>• 不鮮明な画像や不適切なファイルは却下される場合があります</li>
                <li>• 虚偽の情報を提供した場合、アカウントが停止される可能性があります</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
