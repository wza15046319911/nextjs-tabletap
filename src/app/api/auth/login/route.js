import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT秘钥，在实际应用中应该从环境变量读取
const JWT_SECRET = process.env.JWT_SECRET || 'table-tap-secret-key';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: '请输入邮箱和密码' },
        { status: 400 }
      );
    }
    
    // 查找用户
    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (user.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user[0].password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }
    
    // 处理用户角色 - 兼容role和is_admin两种字段
    let userRole = 'customer';
    if ('role' in user[0]) {
      userRole = user[0].role;
    } else if ('is_admin' in user[0] && user[0].is_admin) {
      userRole = 'admin';
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { 
        id: user[0].id,
        email: user[0].email,
        role: userRole
      },
      JWT_SECRET,
      { expiresIn: '7d' } // 令牌7天有效
    );
    
    // 设置Cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7天
      sameSite: 'strict'
    });
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user[0];
    
    // 确保返回的用户信息包含role字段
    if (!('role' in userWithoutPassword)) {
      userWithoutPassword.role = userRole;
    }
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
} 