import { NextResponse } from 'next/server';
import db from '@/db';
import { orders, orderItems, payments } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // 获取订单信息
    const orderData = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(id, 10)))
      .limit(1);
    
    if (orderData.length === 0) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }
    
    // 获取订单项
    const orderItemsList = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, parseInt(id, 10)));
    
    // 获取支付信息
    const paymentData = await db.select()
      .from(payments)
      .where(eq(payments.orderId, parseInt(id, 10)))
      .limit(1);
    
    return NextResponse.json({
      ...orderData[0],
      items: orderItemsList,
      payment: paymentData.length > 0 ? paymentData[0] : null
    });
    
  } catch (error) {
    console.error('获取订单详情失败:', error);
    return NextResponse.json(
      { error: '获取订单详情失败' },
      { status: 500 }
    );
  }
} 