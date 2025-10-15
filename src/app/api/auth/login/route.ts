import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { loginSchema } from '@/lib/validators'
import { verifyPassword, generateToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // バリデーション
    const validatedData = loginSchema.parse(body)
    
    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (!user) {
      return errorResponse('メールアドレスまたはパスワードが正しくありません', 401)
    }
    
    // パスワード検証
    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.password
    )
    
    if (!isValidPassword) {
      return errorResponse('メールアドレスまたはパスワードが正しくありません', 401)
    }
    
    // JWTトークン生成
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType as 'SHIPPER' | 'CARRIER',
    })
    
    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType as 'SHIPPER' | 'CARRIER',
        companyName: user.companyName,
        contactPerson: user.contactPerson,
        phone: user.phone,
      },
      token,
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return errorResponse(error.errors[0].message)
    }
    console.error('Login error:', error)
    return errorResponse('ログインに失敗しました', 500)
  }
}

