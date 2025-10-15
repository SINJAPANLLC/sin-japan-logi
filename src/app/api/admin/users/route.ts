import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/auth'

// 管理者権限チェックミドルウェア
async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.json(
      { error: '管理者認証が必要です' },
      { status: 401 }
    )
  }

  const payload = verifyAdminSession(token)

  if (!payload) {
    return NextResponse.json(
      { error: '無効な管理者認証です' },
      { status: 401 }
    )
  }

  return payload
}

// 全ユーザー取得
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userType = searchParams.get('userType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (userType && userType !== 'all') {
      where.userType = userType
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { contactPerson: { contains: search } },
        { email: { contains: search } }
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          shipments: {
            select: {
              id: true,
              status: true,
              createdAt: true
            }
          },
          vehicles: {
            select: {
              id: true,
              vehicleType: true,
              status: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    // 統計情報を追加
    const usersWithStats = users.map(user => ({
      ...user,
      totalShipments: user.shipments.length,
      completedShipments: user.shipments.filter(s => s.status === 'DELIVERED').length,
      totalVehicles: user.vehicles.length,
      activeVehicles: user.vehicles.filter(v => v.status === 'AVAILABLE').length,
      lastLogin: user.updatedAt, // 実際には別テーブルで管理
      creditScore: Math.floor(Math.random() * 40) + 60, // デモ用
      rating: (Math.random() * 2 + 3).toFixed(1), // デモ用
      monthlyRevenue: Math.floor(Math.random() * 3000000) + 500000, // デモ用
      totalRevenue: Math.floor(Math.random() * 20000000) + 2000000, // デモ用
      verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending' // デモ用
    }))

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// ユーザー承認/拒否
export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const { userId, action, reason } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'ユーザーIDとアクションが必要です' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    let updateData: any = {}
    
    if (action === 'approve') {
      updateData = { 
        status: 'approved',
        verificationStatus: 'verified'
      }
    } else if (action === 'reject') {
      updateData = { 
        status: 'rejected',
        verificationStatus: 'rejected'
      }
    } else if (action === 'suspend') {
      updateData = { status: 'suspended' }
    } else {
      return NextResponse.json(
        { error: '無効なアクションです' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    // 実際の実装では、アクションログを記録
    console.log(`Admin ${admin.userId} ${action} user ${userId}${reason ? ` with reason: ${reason}` : ''}`)

    return NextResponse.json({
      message: `ユーザーを${action === 'approve' ? '承認' : action === 'reject' ? '拒否' : '停止'}しました`,
      user: updatedUser
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
