'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PageHeader from '@/components/layout/PageHeader'
import CreditCardForm from '@/components/payment/CreditCardForm'
import OrderSummary from '@/components/order/OrderSummary'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'
import { cartAPI, orderAPI, paymentAPI } from '@/services/api'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tableId = searchParams.get('table')
  const sessionId = 'guest-session'
  
  const [cart, setCart] = useState(null)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState(null)
  const [orderNotes, setOrderNotes] = useState('')
  
  // 获取购物车数据
  useEffect(() => {
    if (!tableId) return
    
    async function fetchCart() {
      setLoading(true)
      try {
        const cartData = await cartAPI.getCart(tableId, sessionId)
        setCart(cartData)
        
        if (!cartData.items || cartData.items.length === 0) {
          setError('购物车为空，无法结账')
        }
      } catch (err) {
        console.error('获取购物车失败', err)
        setError('获取购物车失败，请重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCart()
  }, [tableId, sessionId])
  
  // 创建订单
  const handleCreateOrder = async () => {
    if (!cart || !cart.id || creatingOrder) return
    
    setCreatingOrder(true)
    setError(null)
    
    try {
      const orderData = await orderAPI.createOrder({
        cartId: cart.id,
        tableId,
        notes: orderNotes,
        paymentMethod: 'credit_card'
      })
      
      setOrder(orderData.order)
    } catch (err) {
      console.error('创建订单失败', err)
      setError('创建订单失败，请重试')
    } finally {
      setCreatingOrder(false)
    }
  }
  
  // 处理支付
  const handlePayment = async (cardDetails) => {
    if (!order || processingPayment) return
    
    setProcessingPayment(true)
    setError(null)
    
    try {
      const paymentData = await paymentAPI.processPayment({
        orderId: order.id,
        amount: order.total,
        paymentMethod: 'credit_card',
        paymentDetails: cardDetails
      })
      
      if (paymentData.success) {
        // 支付成功，跳转到订单详情页
        router.push(`/order/${order.id}?table=${tableId}`)
      } else {
        setError('支付失败，请重试')
      }
    } catch (err) {
      console.error('处理支付失败', err)
      setError('支付失败，请重试')
    } finally {
      setProcessingPayment(false)
    }
  }
  
  // 返回购物车
  const handleBackToCart = () => {
    router.push(`/cart?table=${tableId}`)
  }
  
  if (!tableId) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="结账" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-amber-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">无法访问结账页面</h2>
            <p className="text-gray-600 mb-6">请扫描餐桌上的二维码访问菜单</p>
            <Button onClick={() => router.push('/')}>返回首页</Button>
          </div>
        </div>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="结账" backUrl={`/cart?table=${tableId}`} />
        <Loading />
      </div>
    )
  }
  
  if (error && !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="结账" backUrl={`/cart?table=${tableId}`} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">出错了</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={handleBackToCart}>返回购物车</Button>
          </div>
        </div>
      </div>
    )
  }
  
  // 显示支付页面
  if (order) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="支付订单" />
        
        <div className="p-4 flex-1">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <OrderSummary order={order} showItems={false} />
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}
            
            <CreditCardForm 
              amount={Number(order.total)} 
              onSubmit={handlePayment} 
              disabled={processingPayment}
            />
          </div>
        </div>
      </div>
    )
  }
  
  // 显示订单确认页面
  return (
    <div className="min-h-screen flex flex-col pb-24">
      <PageHeader title="确认订单" backUrl={`/cart?table=${tableId}`} />
      
      <div className="p-4 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold">订单商品</h2>
            </div>
            
            <ul className="divide-y divide-gray-100 p-4">
              {cart?.items?.map((item) => (
                <li key={item.id} className="py-2">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      
                      {item.options && item.options.length > 0 && (
                        <div className="text-sm text-gray-500 flex flex-wrap gap-1 mt-1">
                          {item.options.map((option, index) => (
                            <span key={index} className="inline-block">
                              {option.name}{option.price > 0 ? ` +¥${option.price}` : ''}
                              {index < item.options.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.notes && (
                        <div className="text-sm text-gray-500 mt-1">
                          备注: {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="text-amber-600 font-medium">
                      ¥{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="p-4 border-t border-gray-100">
              <div className="flex justify-between">
                <div className="font-medium">合计</div>
                <div className="text-xl text-amber-600 font-bold">¥{Number(cart?.total || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold">订单备注</h2>
            </div>
            
            <div className="p-4">
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="如有特殊要求，请在此备注"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold">支付方式</h2>
            </div>
            
            <div className="p-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="credit_card"
                  name="payment_method"
                  checked
                  readOnly
                  className="mr-2"
                />
                <label htmlFor="credit_card" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  银行卡支付
                </label>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-gray-600">合计:</span>
              <span className="text-xl font-bold text-amber-600 ml-2">¥{Number(cart?.total || 0).toFixed(2)}</span>
            </div>
            <Button 
              onClick={handleCreateOrder} 
              disabled={creatingOrder || !cart?.items?.length}
            >
              {creatingOrder ? '处理中...' : '提交订单'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 