'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'
import Loading from '@/components/ui/Loading'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  
  // 模拟获取订单数据
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 模拟订单数据
        const now = new Date()
        const ordersData = [
          {
            id: 1,
            orderNumber: 'ORD-1649583920-3847',
            createdAt: new Date(now.getTime() - 1000 * 60 * 30), // 30分钟前
            total: 125.50,
            status: 'pending',
            paymentStatus: 'pending',
            tableId: 3,
            items: 4
          },
          {
            id: 2,
            orderNumber: 'ORD-1649582840-1234',
            createdAt: new Date(now.getTime() - 1000 * 60 * 60), // 1小时前
            total: 89.00,
            status: 'processing',
            paymentStatus: 'paid',
            tableId: 5,
            items: 2
          },
          {
            id: 3,
            orderNumber: 'ORD-1649579220-7890',
            createdAt: new Date(now.getTime() - 1000 * 60 * 120), // 2小时前
            total: 246.75,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 2,
            items: 6
          },
          {
            id: 4,
            orderNumber: 'ORD-1649575620-4567',
            createdAt: new Date(now.getTime() - 1000 * 60 * 180), // 3小时前
            total: 158.25,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 4,
            items: 3
          },
          {
            id: 5,
            orderNumber: 'ORD-1649572020-9876',
            createdAt: new Date(now.getTime() - 1000 * 60 * 240), // 4小时前
            total: 78.50,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 1,
            items: 2
          },
          {
            id: 6,
            orderNumber: 'ORD-1649568420-5432',
            createdAt: new Date(now.getTime() - 1000 * 60 * 300), // 5小时前
            total: 115.00,
            status: 'cancelled',
            paymentStatus: 'refunded',
            tableId: 7,
            items: 3
          },
          {
            id: 7,
            orderNumber: 'ORD-1649564820-2109',
            createdAt: new Date(now.getTime() - 1000 * 60 * 360), // 6小时前
            total: 192.50,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 6,
            items: 5
          },
          {
            id: 8,
            orderNumber: 'ORD-1649561220-8765',
            createdAt: new Date(now.getTime() - 1000 * 60 * 420), // 7小时前
            total: 67.25,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 3,
            items: 2
          },
          {
            id: 9,
            orderNumber: 'ORD-1649557620-4321',
            createdAt: new Date(now.getTime() - 1000 * 60 * 480), // 8小时前
            total: 145.00,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 5,
            items: 4
          },
          {
            id: 10,
            orderNumber: 'ORD-1649554020-0987',
            createdAt: new Date(now.getTime() - 1000 * 60 * 540), // 9小时前
            total: 88.75,
            status: 'cancelled',
            paymentStatus: 'refunded',
            tableId: 2,
            items: 3
          }
        ]
        
        setOrders(ordersData)
        setFilteredOrders(ordersData)
      } catch (error) {
        console.error('获取订单数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [])
  
  // 处理状态过滤
  useEffect(() => {
    filterOrders()
  }, [selectedStatus, searchQuery, dateRange, orders])
  
  // 过滤订单
  const filterOrders = () => {
    let result = [...orders]
    
    // 按状态过滤
    if (selectedStatus !== 'all') {
      result = result.filter(order => order.status === selectedStatus)
    }
    
    // 按搜索关键词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(query) || 
        order.tableId.toString().includes(query)
      )
    }
    
    // 按日期范围过滤
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from)
      fromDate.setHours(0, 0, 0, 0)
      result = result.filter(order => new Date(order.createdAt) >= fromDate)
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to)
      toDate.setHours(23, 59, 59, 999)
      result = result.filter(order => new Date(order.createdAt) <= toDate)
    }
    
    setFilteredOrders(result)
  }
  
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
  
  // 格式化日期
  const formatDate = (date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 处理日期变更
  const handleDateChange = (e) => {
    const { name, value } = e.target
    setDateRange(prev => ({ ...prev, [name]: value }))
  }
  
  // 处理订单状态更新
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    )
  }
  
  // 查看订单详情
  const handleViewOrder = (orderId) => {
    router.push(`/admin/orders/${orderId}`)
  }
  
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">订单管理</h1>
        
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* 过滤工具栏 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    订单状态
                  </label>
                  <select
                    id="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">全部</option>
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    搜索
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="订单号或桌号"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期
                  </label>
                  <input
                    id="dateFrom"
                    type="date"
                    name="from"
                    value={dateRange.from}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期
                  </label>
                  <input
                    id="dateTo"
                    type="date"
                    name="to"
                    value={dateRange.to}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
            
            {/* 订单列表 */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">订单列表</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        订单号
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        桌号
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        支付状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金额
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          暂无订单数据
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => {
                        const statusInfo = formatStatus(order.status)
                        const paymentStatusInfo = formatPaymentStatus(order.paymentStatus)
                        
                        return (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.orderNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.tableId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.className}`}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusInfo.className}`}>
                                {paymentStatusInfo.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ¥{order.total.toFixed(2)}
                              <div className="text-xs text-gray-500">{order.items}件商品</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleViewOrder(order.id)}
                                className="text-amber-600 hover:text-amber-900 mr-3"
                              >
                                详情
                              </button>
                              
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'processing')}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  开始处理
                                </button>
                              )}
                              
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'completed')}
                                  className="text-green-600 hover:text-green-900 mr-3"
                                >
                                  完成
                                </button>
                              )}
                              
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  取消
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
} 