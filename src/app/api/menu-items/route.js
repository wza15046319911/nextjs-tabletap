import { NextResponse } from 'next/server';
import db from '@/db';
import { menuItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// 获取菜单项（可按分类筛选）
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    
    let query = db.select().from(menuItems);
    
    if (categoryId) {
      query = query.where(and(
        eq(menuItems.categoryId, parseInt(categoryId)),
        eq(menuItems.isAvailable, true)
      ));
    } else {
      query = query.where(eq(menuItems.isAvailable, true));
    }
    
    const items = await query.orderBy(menuItems.displayOrder);
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('获取菜单项失败:', error);
    return NextResponse.json(
      { error: '获取菜单项失败' },
      { status: 500 }
    );
  }
} 