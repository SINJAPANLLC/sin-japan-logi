import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 検索パラメータを取得
    const vehicleType = searchParams.get('vehicleType') || ''
    const prefecture = searchParams.get('prefecture') || ''
    const status = searchParams.get('status') || 'AVAILABLE'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // 検索条件を構築
    const where: any = {}

    // 車両タイプ
    if (vehicleType) {
      where.vehicleType = vehicleType
    }

    // 都道府県（JSON配列内を検索）
    if (prefecture) {
      where.availablePrefectures = {
        contains: prefecture
      }
    }

    // ステータス
    if (status) {
      where.status = status
    }

    // 現在日時でフィルタリング（利用可能な期間内）
    const now = new Date()
    where.availableFrom = {
      lte: now
    }
    where.availableTo = {
      gte: now
    }

    // 車両を検索
    const [vehicles, totalCount] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          carrier: {
            select: {
              id: true,
              companyName: true,
              contactPerson: true,
              phone: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.vehicle.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        vehicles,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      )
    }

    // トークンからユーザー情報を取得（簡易実装）
    // 実際の実装では、JWTトークンを検証する必要があります
    const user = await prisma.user.findFirst({
      where: { userType: 'CARRIER' }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // 都道府県配列をJSON文字列に変換
    const availablePrefectures = JSON.stringify(body.availablePrefectures || [])

    // 車両を作成
    const vehicle = await prisma.vehicle.create({
      data: {
        carrierId: user.id,
        vehicleType: body.vehicleType,
        vehicleNumber: body.vehicleNumber,
        driverName: body.driverName,
        driverPhone: body.driverPhone,
        maxWeight: parseFloat(body.maxWeight),
        maxVolume: body.maxVolume ? parseFloat(body.maxVolume) : null,
        length: body.length ? parseFloat(body.length) : null,
        width: body.width ? parseFloat(body.width) : null,
        height: body.height ? parseFloat(body.height) : null,
        hasLiftGate: body.hasLiftGate || false,
        hasRefrigeration: body.hasRefrigeration || false,
        hasTemperatureControl: body.hasTemperatureControl || false,
        canLoadUnload: body.canLoadUnload !== false,
        availablePrefectures,
        availableFrom: new Date(body.availableFrom),
        availableTo: new Date(body.availableTo),
        basePrice: body.basePrice ? parseFloat(body.basePrice) : null,
        minPrice: body.minPrice ? parseFloat(body.minPrice) : null,
        status: body.status || 'AVAILABLE',
        notes: body.notes || null
      },
      include: {
        carrier: {
          select: {
            id: true,
            companyName: true,
            contactPerson: true,
            phone: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
