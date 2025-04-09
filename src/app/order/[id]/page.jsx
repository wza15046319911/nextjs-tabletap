'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import PageHeader from '@/components/layout/PageHeader'
import OrderSummary from '@/components/order/OrderSummary'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'
import { orderAPI } from '@/services/api'

export default function OrderDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { id } = params
  const tableId = searchParams.get('table')
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // 获取订单详情
  useEffect(() => {
    if (!id) return
    
    async function fetchOrder() {
      setLoading(true)
      try {
        const orderData = await orderAPI.getOrder(id)
        setOrder(orderData)
      } catch (err) {
        console.error('获取订单详情失败', err)
        setError('获取订单详情失败，请重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
    
    // 如果订单状态还在处理中，定期刷新
    const intervalId = setInterval(() => {
      if (order && (order.status === 'pending' || order.status === 'processing')) {
        fetchOrder()
      }
    }, 10000) // 每10秒刷新一次
    
    return () => clearInterval(intervalId)
  }, [id, order?.status])
  
  // 返回菜单
  const handleBackToMenu = () => {
    router.push(`/menu?table=${tableId}`)
  }
  
  // 返回首页
  const handleBackToHome = () => {
    router.push('/')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="订单详情" />
        <Loading />
      </div>
    )
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="订单详情" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">出错了</h2>
            <p className="text-gray-600 mb-6">{error || '无法查询到订单信息'}</p>
            <Button onClick={tableId ? handleBackToMenu : handleBackToHome}>
              {tableId ? '返回菜单' : '返回首页'}
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="订单详情" backUrl={tableId ? `/menu?table=${tableId}` : '/'} />
      
      <div className="p-4 flex-1">
        <div className="max-w-3xl mx-auto">
          {/* 订单状态提示 */}
          {order.status === 'pending' && order.paymentStatus === 'pending' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">等待支付</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    您的订单尚未完成支付，请完成支付以便我们开始准备您的美食。
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {order.status === 'processing' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">正在准备中</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    我们已收到您的订单并正在精心准备，请稍候片刻，美食即将送达！
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {order.status === 'completed' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">订单已完成</h3>
                  <p className="mt-1 text-sm text-green-700">
                    您的订单已完成，祝您用餐愉快！
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {order.status === 'cancelled' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">订单已取消</h3>
                  <p className="mt-1 text-sm text-red-700">
                    很抱歉，您的订单已被取消。如有疑问，请联系店员。
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* 订单详情 */}
          <OrderSummary order={order} showItems={true} />
          
          {/* 底部操作按钮 */}
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleBackToMenu}
              variant="outline"
              className="w-full max-w-xs"
            >
              继续点餐
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 