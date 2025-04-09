import { NextResponse } from 'next/server';
import db from '@/db';
import { cartItems, menuItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// 添加商品到购物车
export async function POST(request) {
  try {
    const body = await request.json();
    const { cartId, menuItemId, quantity = 1, options = [], notes = '' } = body;
    
    if (!cartId || !menuItemId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    // 获取菜单项价格
    const menuItem = await db.select()
      .from(menuItems)
      .where(eq(menuItems.id, parseInt(menuItemId, 10)))
      .limit(1);
    
    if (menuItem.length === 0) {
      return NextResponse.json(
        { error: '菜品不存在' },
        { status: 404 }
      );
    }
    
    // 准备选项的JSON字符串
    const optionsJson = Array.isArray(options) ? options : [];
    
    // 检查购物车中是否已有相同商品和选项
    const existingItem = await db.select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, parseInt(cartId, 10)),
          eq(cartItems.menuItemId, parseInt(menuItemId, 10))
          // 暂时移除选项和备注的匹配，简化逻辑
        )
      )
      .limit(1);
    
    let newItem;
    
    if (existingItem.length > 0) {
      // 如果已存在，则更新数量
      newItem = await db.update(cartItems)
        .set({
          quantity: existingItem[0].quantity + parseInt(quantity, 10)
        })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
    } else {
      // 否则添加新商品
      newItem = await db.insert(cartItems)
        .values({
          cartId: parseInt(cartId, 10),
          menuItemId: parseInt(menuItemId, 10),
          quantity: parseInt(quantity, 10),
          price: menuItem[0].price,
          options: optionsJson,
          notes: notes || ''
        })
        .returning();
    }
    
    return NextResponse.json(newItem[0], { status: 201 });
    
  } catch (error) {
    console.error('添加购物车商品失败:', error);
    return NextResponse.json(
      { error: '添加购物车商品失败' },
      { status: 500 }
    );
  }
} 