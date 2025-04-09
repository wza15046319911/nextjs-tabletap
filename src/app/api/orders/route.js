import { NextResponse } from 'next/server';
import db from '@/db';
import { orders, orderItems, carts, cartItems, menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
  try {
    const body = await request.json();
    const { cartId, tableId, notes = '', paymentMethod } = body;
    
    if (!cartId || !tableId || !paymentMethod) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    // 获取购物车和商品
    const cart = await db.select().from(carts)
      .where(eq(carts.id, parseInt(cartId, 10)))
      .limit(1);
    
    if (cart.length === 0) {
      return NextResponse.json(
        { error: '购物车不存在' },
        { status: 404 }
      );
    }
    
    const cartItemsList = await db.select({
      cartItem: cartItems,
      menuItem: menuItems
    })
    .from(cartItems)
    .innerJoin(menuItems, eq(cartItems.menuItemId, menuItems.id))
    .where(eq(cartItems.cartId, parseInt(cartId, 10)));
    
    if (cartItemsList.length === 0) {
      return NextResponse.json(
        { error: '购物车为空' },
        { status: 400 }
      );
    }
    
    // 计算订单总价
    const total = cartItemsList.reduce((sum, { cartItem }) => 
      sum + Number(cartItem.price) * cartItem.quantity, 0);
    
    // 生成订单号
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // 创建订单
    const createdOrder = await db.insert(orders)
      .values({
        orderNumber,
        userId: null, // 未登录用户
        tableId: parseInt(tableId, 10),
        status: 'pending',
        total,
        notes,
        paymentMethod,
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    const orderId = createdOrder[0].id;
    
    // 创建订单项
    for (const { cartItem, menuItem } of cartItemsList) {
      await db.insert(orderItems)
        .values({
          orderId,
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: cartItem.price,
          quantity: cartItem.quantity,
          options: cartItem.options,
          notes: cartItem.notes,
          createdAt: new Date()
        });
    }
    
    // 清空购物车（保留购物车记录但删除商品）
    await db.delete(cartItems)
      .where(eq(cartItems.cartId, parseInt(cartId, 10)));
    
    // 更新购物车总价为0
    await db.update(carts)
      .set({ total: 0 })
      .where(eq(carts.id, parseInt(cartId, 10)));
    
    return NextResponse.json({
      success: true,
      order: createdOrder[0]
    });
    
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json(
      { error: '创建订单失败' },
      { status: 500 }
    );
  }
} 