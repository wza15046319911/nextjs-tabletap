import { NextResponse } from 'next/server';
import db from '@/db';
import { cartItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 更新购物车中的商品数量
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { quantity } = body;
    const parsedQuantity = parseInt(quantity, 10);
    
    if (parsedQuantity < 1) {
      return NextResponse.json(
        { error: '商品数量必须大于0' },
        { status: 400 }
      );
    }
    
    const updatedItem = await db.update(cartItems)
      .set({ quantity: parsedQuantity })
      .where(eq(cartItems.id, parseInt(id, 10)))
      .returning();
    
    if (updatedItem.length === 0) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedItem[0]);
    
  } catch (error) {
    console.error('更新购物车商品失败:', error);
    return NextResponse.json(
      { error: '更新购物车商品失败' },
      { status: 500 }
    );
  }
}

// 从购物车中删除商品
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await db.delete(cartItems)
      .where(eq(cartItems.id, parseInt(id, 10)));
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('删除购物车商品失败:', error);
    return NextResponse.json(
      { error: '删除购物车商品失败' },
      { status: 500 }
    );
  }
} 