import { NextResponse } from 'next/server';
import db from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码为必填项' },
        { status: 400 }
      );
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }
    
    // 检查邮箱是否已被注册
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      );
    }
    
    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 检查数据库结构 - 避免递归循环
    let userFields;
    try {
      // 检查users表的结构
      const tableInfo = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `);
      
      const hasRoleColumn = tableInfo.some(col => col.column_name === 'role');
      
      if (hasRoleColumn) {
        userFields = {
          email,
          password: hashedPassword,
          name: name || email.split('@')[0],
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } else {
        userFields = {
          email,
          password: hashedPassword,
          name: name || email.split('@')[0],
          is_admin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    } catch (error) {
      console.error('无法检查表结构:', error);
      // 默认尝试使用role字段
      userFields = {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    // 创建用户
    const newUser = await db.insert(users)
      .values(userFields)
      .returning();
    
    // 处理返回数据 - 统一格式
    const userData = newUser[0];
    if (userData.is_admin !== undefined && userData.role === undefined) {
      userData.role = userData.is_admin ? 'admin' : 'customer';
      delete userData.is_admin;
    }
    
    // 移除密码字段
    const { password: _, ...userDataWithoutPassword } = userData;
    
    return NextResponse.json({
      success: true,
      user: userDataWithoutPassword
    });
    
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    );
  }
} 