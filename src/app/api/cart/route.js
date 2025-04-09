import { NextResponse } from 'next/server';
import db from '@/db';
import { carts, cartItems, menuItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// 获取购物车信息
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('table');
    const sessionId = searchParams.get('session') || 'guest-session'; // 默认会话ID
    
    if (!tableId) {
      return NextResponse.json(
        { error: '缺少桌号参数' },
        { status: 400 }
      );
    }
    
    // 先查找是否已存在购物车
    let cart = await db.select().from(carts)
      .where(
        and(
          eq(carts.tableId, parseInt(tableId, 10)),
          eq(carts.sessionId, sessionId)
        )
      )
      .limit(1);
    
    // 如果不存在，则创建新购物车
    if (cart.length === 0) {
      try {
        const newCart = await db.insert(carts)
          .values({
            tableId: parseInt(tableId, 10),
            sessionId: sessionId,
            total: 0
          })
          .returning();
        
        cart = newCart;
      } catch (error) {
        console.error('创建购物车失败:', error);
        // 提供一个默认的购物车响应以避免前端错误
        return NextResponse.json({
          id: 0,
          tableId: parseInt(tableId, 10),
          sessionId,
          items: [],
          total: 0,
          itemCount: 0
        });
      }
    } else {
      cart = cart;
    }
    
    // 获取购物车中的商品
    const items = await db.select({
      cartItem: cartItems,
      menuItem: menuItems
    })
    .from(cartItems)
    .innerJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
    .where(eq(cartItems.cartId, cart[0].id));
    
    // 计算购物车总价
    const total = items.reduce((sum, { cartItem }) => 
      sum + Number(cartItem.price) * cartItem.quantity, 0);
    
    // 更新购物车总价
    try {
      await db.update(carts)
        .set({ total })
        .where(eq(carts.id, cart[0].id));
    } catch (error) {
      console.error('更新购物车总价失败:', error);
    }
    
    // 格式化购物车商品
    const formattedItems = items.map(({ cartItem, menuItem }) => ({
      id: cartItem.id,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: cartItem.price,
      quantity: cartItem.quantity,
      options: cartItem.options,
      notes: cartItem.notes
    }));
    
    return NextResponse.json({
      id: cart[0].id,
      tableId: parseInt(tableId, 10),
      sessionId,
      items: formattedItems,
      total,
      itemCount: formattedItems.reduce((count, item) => count + item.quantity, 0)
    });
    
  } catch (error) {
    console.error('获取购物车失败:', error);
    // 提供一个默认的购物车响应以避免前端错误
    return NextResponse.json({
      id: 0,
      tableId: parseInt(request.nextUrl.searchParams.get('table') || '0', 10),
      sessionId: request.nextUrl.searchParams.get('session') || 'guest-session',
      items: [],
      total: 0,
      itemCount: 0
    });
  }
}

// 清空购物车
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('id');
    
    if (!cartId) {
      return NextResponse.json(
        { error: '缺少购物车ID' },
        { status: 400 }
      );
    }
    
    // 先删除购物车中的商品
    await db.delete(cartItems)
      .where(eq(cartItems.cartId, parseInt(cartId, 10)));
    
    // 更新购物车总价为0
    await db.update(carts)
      .set({ total: 0 })
      .where(eq(carts.id, parseInt(cartId, 10)));
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('清空购物车失败:', error);
    return NextResponse.json(
      { error: '清空购物车失败' },
      { status: 500 }
    );
  }
} 