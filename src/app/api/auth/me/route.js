import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

// JWT秘钥，在实际应用中应该从环境变量读取
const JWT_SECRET = process.env.JWT_SECRET || 'table-tap-secret-key';

export async function GET() {
  try {
    // 获取令牌
    const token = await cookies().get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    try {
      // 验证令牌
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // 尝试获取用户信息 - 先尝试包含role字段的查询
      let user;
      
      try {
        // 尝试使用role字段查询
        user = await db.select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role,
          createdAt: users.createdAt
        })
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);
      } catch (error) {
        if (error.message.includes('column "role" does not exist')) {
          // 如果role字段不存在，尝试使用is_admin字段
          user = await db.select({
            id: users.id,
            email: users.email,
            name: users.name,
            is_admin: users.is_admin,
            createdAt: users.createdAt
          })
          .from(users)
          .where(eq(users.id, decoded.id))
          .limit(1);
          
          // 如果查询成功，添加role字段
          if (user.length > 0) {
            user[0].role = user[0].is_admin ? 'admin' : 'customer';
            delete user[0].is_admin; // 删除is_admin字段，统一使用role
          }
        } else {
          // 如果是其他错误，则抛出
          throw error;
        }
      }
      
      if (!user || user.length === 0) {
        return NextResponse.json(
          { error: '用户不存在' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        user: user[0]
      });
      
    } catch (error) {
      console.error('令牌验证失败:', error);
      
      // 清除无效令牌
      cookies().set({
        name: 'auth_token',
        value: '',
        httpOnly: true,
        path: '/',
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return NextResponse.json(
        { error: '会话已过期，请重新登录' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { error: '获取用户信息失败，请重试' },
      { status: 500 }
    );
  }
} 