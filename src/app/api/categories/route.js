import { NextResponse } from 'next/server';
import db from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 获取所有菜单分类
export async function GET() {
  try {
    const allCategories = await db.select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.displayOrder);
    
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 }
    );
  }
} 