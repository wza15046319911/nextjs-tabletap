'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'
import Loading from '@/components/ui/Loading'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 模拟从API获取数据
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 模拟加载统计数据
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 这里可以替换为真实的API调用
        setStats({
          totalOrders: 128,
          pendingOrders: 5,
          todaySales: 3680.50,
          thisWeekSales: 18950.75
        })
        
        // 模拟最近的订单
        setRecentOrders([
          {
            id: 1,
            orderNumber: 'ORD-1649583920-3847',
            createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
            total: 125.50,
            status: 'pending',
            paymentStatus: 'pending',
            tableId: 3
          },
          {
            id: 2,
            orderNumber: 'ORD-1649582840-1234',
            createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1小时前
            total: 89.00,
            status: 'processing',
            paymentStatus: 'paid',
            tableId: 5
          },
          {
            id: 3,
            orderNumber: 'ORD-1649579220-7890',
            createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2小时前
            total: 246.75,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 2
          },
          {
            id: 4,
            orderNumber: 'ORD-1649575620-4567',
            createdAt: new Date(Date.now() - 1000 * 60 * 180), // 3小时前
            total: 158.25,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 4
          },
          {
            id: 5,
            orderNumber: 'ORD-1649572020-9876',
            createdAt: new Date(Date.now() - 1000 * 60 * 240), // 4小时前
            total: 78.50,
            status: 'completed',
            paymentStatus: 'paid',
            tableId: 1
          }
        ])
      } catch (error) {
        console.error('加载仪表盘数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
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
  
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
        
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">总订单数</p>
                    <h3 className="text-2xl font-bold">{stats?.totalOrders}</h3>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">待处理订单</p>
                    <h3 className="text-2xl font-bold">{stats?.pendingOrders}</h3>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">今日销售额</p>
                    <h3 className="text-2xl font-bold">¥{stats?.todaySales.toFixed(2)}</h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">本周销售额</p>
                    <h3 className="text-2xl font-bold">¥{stats?.thisWeekSales.toFixed(2)}</h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 最近订单 */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">最近订单</h2>
                <Link 
                  href="/admin/orders" 
                  className="text-sm text-amber-600 hover:text-amber-700"
                >
                  查看全部
                </Link>
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
                        金额
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        支付状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        桌号
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => {
                      const statusInfo = formatStatus(order.status)
                      const paymentStatusInfo = formatPaymentStatus(order.paymentStatus)
                      
                      return (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥{order.total.toFixed(2)}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.tableId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="text-amber-600 hover:text-amber-900 mr-4"
                            >
                              详情
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
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