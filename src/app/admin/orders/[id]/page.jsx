'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import SafeImage from '@/components/ui/SafeImage'
import AdminLayout from '@/components/layout/AdminLayout'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 模拟获取订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true)
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 模拟订单详情数据
        const orderDetail = {
          id: parseInt(id),
          orderNumber: `ORD-1649583920-${id}`,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
          total: 125.50,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'alipay',
          tableId: 3,
          notes: '不要放葱',
          items: [
            {
              id: 1,
              name: '美式咖啡',
              price: 18.00,
              quantity: 2,
              options: [
                { name: '温度', value: '热' },
                { name: '糖量', value: '无糖' }
              ],
              notes: '',
              imageUrl: 'https://placehold.co/600x400?text=美式咖啡'
            },
            {
              id: 2,
              name: '提拉米苏',
              price: 32.00,
              quantity: 1,
              options: [],
              notes: '',
              imageUrl: 'https://placehold.co/600x400?text=提拉米苏'
            },
            {
              id: 3,
              name: '意面套餐',
              price: 42.00,
              quantity: 1,
              options: [
                { name: '辣度', value: '中辣' }
              ],
              notes: '不要放葱',
              imageUrl: 'https://placehold.co/600x400?text=意面套餐'
            }
          ]
        }
        
        setOrder(orderDetail)
      } catch (error) {
        console.error('获取订单详情失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchOrderDetail()
    }
  }, [id])
  
  // 格式化状态
  const formatStatus = (status) => {
    switch (status) {
      case 'pending':
        return { label: '待处理', className: 'bg-yellow-100 text-yellow-800' }
      case 'processing':
        return { label: '处理中', className: 'bg-blue-100 text-blue-800' }
      case 'completed':
        return { label: '已完成', className: 'bg-green-100 text-green-800' }
      case 'cancelled':
        return { label: '已取消', className: 'bg-red-100 text-red-800' }
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800' }
    }
  }
  
  // 格式化支付状态
  const formatPaymentStatus = (status) => {
    switch (status) {
      case 'pending':
        return { label: '待支付', className: 'bg-yellow-100 text-yellow-800' }
      case 'paid':
        return { label: '已支付', className: 'bg-green-100 text-green-800' }
      case 'failed':
        return { label: '支付失败', className: 'bg-red-100 text-red-800' }
      case 'refunded':
        return { label: '已退款', className: 'bg-gray-100 text-gray-800' }
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800' }
    }
  }
  
  // 格式化支付方式
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'alipay':
        return '支付宝'
      case 'wechat':
        return '微信支付'
      case 'credit_card':
        return '银行卡'
      case 'cash':
        return '现金'
      default:
        return method
    }
  }
  
  // 格式化日期
  const formatDate = (date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  // 处理订单状态更新
  const handleUpdateStatus = (newStatus) => {
    setOrder(prev => ({ ...prev, status: newStatus }))
  }
  
  // 计算订单总数量
  const getTotalQuantity = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0)
  }
  
  // 处理打印订单
  const handlePrintOrder = () => {
    window.print()
  }
  
  if (loading) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    )
  }
  
  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">订单不存在</h2>
          <p className="text-gray-600 mb-6">无法找到此订单信息</p>
          <Button onClick={() => router.push('/admin/orders')}>
            返回订单列表
          </Button>
        </div>
      </AdminLayout>
    )
  }
  
  const statusInfo = formatStatus(order.status)
  const paymentStatusInfo = formatPaymentStatus(order.paymentStatus)
  
  return (
    <AdminLayout>
      <div className="print:py-8 print:px-6">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-2xl font-bold">订单详情</h1>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handlePrintOrder}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              打印订单
            </Button>
            
            <Link href="/admin/orders">
              <Button
                variant="outline"
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回列表
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 订单信息卡片 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-medium">订单 #{order.orderNumber}</h2>
                <div className="flex items-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                  <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusInfo.className}`}>
                    {paymentStatusInfo.label}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">订单时间</p>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">桌号</p>
                  <p>#{order.tableId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">支付方式</p>
                  <p>{formatPaymentMethod(order.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">订单总额</p>
                  <p className="font-bold text-lg">¥{order.total.toFixed(2)}</p>
                </div>
              </div>
              
              {order.notes && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">订单备注</p>
                  <div className="bg-gray-50 p-3 rounded-md">{order.notes}</div>
                </div>
              )}
              
              <div className="print:hidden">
                <h3 className="font-medium mb-3">更新订单状态</h3>
                <div className="flex flex-wrap gap-2">
                  {order.status !== 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus('pending')}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm"
                    >
                      待处理
                    </button>
                  )}
                  
                  {order.status !== 'processing' && (
                    <button
                      onClick={() => handleUpdateStatus('processing')}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                    >
                      处理中
                    </button>
                  )}
                  
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                    >
                      已完成
                    </button>
                  )}
                  
                  {order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus('cancelled')}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm"
                    >
                      已取消
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 订单统计卡片 */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">订单统计</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品数量</span>
                  <span className="font-medium">{order.items.length}种</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">商品总件数</span>
                  <span className="font-medium">{getTotalQuantity()}件</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">商品总价</span>
                  <span className="font-medium">¥{order.total.toFixed(2)}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold">
                    <span>订单总额</span>
                    <span className="text-amber-600">¥{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 订单商品列表 */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">订单商品</h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {order.items.map(item => (
                  <li key={item.id} className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden">
                        {item.imageUrl ? (
                          <SafeImage
                            src={item.imageUrl}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover h-16 w-16"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">无图</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            
                            {item.options.length > 0 && (
                              <div className="mt-1 text-sm text-gray-500">
                                {item.options.map((option, index) => (
                                  <span key={index}>
                                    {option.name}: {option.value}
                                    {index < item.options.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {item.notes && (
                              <div className="mt-1 text-sm text-gray-500">
                                备注: {item.notes}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-amber-600 font-medium">¥{item.price.toFixed(2)}</div>
                            <div className="text-gray-500">x{item.quantity}</div>
                            <div className="font-bold">¥{(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 