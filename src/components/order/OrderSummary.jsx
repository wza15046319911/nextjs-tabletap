'use client'

import React from 'react'

export default function OrderSummary({ order, showItems = true }) {
  if (!order) return null
  
  const getStatusLabel = (status) => {
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
  
  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return { label: '待支付', className: 'bg-yellow-100 text-yellow-800' }
      case 'completed':
        return { label: '已支付', className: 'bg-green-100 text-green-800' }
      case 'failed':
        return { label: '支付失败', className: 'bg-red-100 text-red-800' }
      case 'refunded':
        return { label: '已退款', className: 'bg-purple-100 text-purple-800' }
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800' }
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const statusInfo = getStatusLabel(order.status)
  const paymentStatusInfo = getPaymentStatusLabel(order.paymentStatus)
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold">订单摘要</h2>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="text-gray-600">订单号</div>
          <div>{order.orderNumber}</div>
        </div>
        
        <div className="flex justify-between mb-2">
          <div className="text-gray-600">下单时间</div>
          <div>{formatDate(order.createdAt)}</div>
        </div>
        
        <div className="flex justify-between mb-2">
          <div className="text-gray-600">订单状态</div>
          <div className={`px-2 py-0.5 rounded text-xs ${statusInfo.className}`}>
            {statusInfo.label}
          </div>
        </div>
        
        <div className="flex justify-between mb-2">
          <div className="text-gray-600">支付状态</div>
          <div className={`px-2 py-0.5 rounded text-xs ${paymentStatusInfo.className}`}>
            {paymentStatusInfo.label}
          </div>
        </div>
        
        <div className="flex justify-between mb-2">
          <div className="text-gray-600">支付方式</div>
          <div>{order.paymentMethod === 'credit_card' ? '银行卡' : order.paymentMethod}</div>
        </div>
        
        {order.notes && (
          <div className="mb-4">
            <div className="text-gray-600 mb-1">订单备注</div>
            <div className="bg-gray-50 p-2 rounded">{order.notes}</div>
          </div>
        )}
        
        {showItems && order.items && order.items.length > 0 && (
          <div className="mt-4">
            <div className="text-gray-600 mb-2">订单商品</div>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
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
                    </div>
                    <div className="text-amber-600 font-medium">
                      ¥{(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="font-medium">总计</div>
            <div className="text-xl text-amber-600 font-bold">¥{Number(order.total).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 