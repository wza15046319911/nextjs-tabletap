import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 清除认证Cookie
    cookies().set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return NextResponse.json({
      success: true,
      message: '已成功登出'
    });
    
  } catch (error) {
    console.error('登出失败:', error);
    return NextResponse.json(
      { error: '登出失败，请重试' },
      { status: 500 }
    );
  }
} 