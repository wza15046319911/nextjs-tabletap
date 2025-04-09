import { NextResponse } from 'next/server';
import db from '@/db';
import { orders, payments, carts, cartItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod, amount, paymentDetails } = body;
    
    if (!orderId || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    // 验证订单是否存在
    const orderExists = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(orderId, 10)))
      .limit(1);
    
    if (orderExists.length === 0) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      );
    }
    
    // 在实际应用中，这里应该有第三方支付接口的集成
    // 这里我们模拟支付成功
    const paymentStatus = 'completed';
    const transactionId = `trx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // 创建支付记录
    const paymentRecord = await db.insert(payments)
      .values({
        orderId: parseInt(orderId, 10),
        amount: parseFloat(amount),
        paymentMethod,
        status: paymentStatus,
        transactionId,
        paymentDetails: paymentDetails || {},
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    // 更新订单状态
    await db.update(orders)
      .set({
        paymentStatus,
        status: 'processing', // 付款后订单状态变为处理中
        updatedAt: new Date()
      })
      .where(eq(orders.id, parseInt(orderId, 10)));
    
    // 返回支付结果
    return NextResponse.json({
      success: true,
      payment: paymentRecord[0],
      transactionId,
      status: paymentStatus
    });
    
  } catch (error) {
    console.error('处理支付失败:', error);
    return NextResponse.json(
      { error: '处理支付失败' },
      { status: 500 }
    );
  }
} 