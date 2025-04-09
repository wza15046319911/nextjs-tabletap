'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TablePage() {
  const params = useParams()
  const router = useRouter()
  const { id: tableId } = params
  
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [countdown, setCountdown] = useState(3)
  
  // 倒计时并重定向
  useEffect(() => {
    if (isRedirecting) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push(`/menu?table=${tableId}`)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [isRedirecting, router, tableId])
  
  // 开始点餐按钮事件处理
  const handleStartOrdering = () => {
    setIsRedirecting(true)
  }
  
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* 顶部区域 */}
      <div className="h-48 bg-amber-600 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">欢迎使用 Table Tap</h1>
          <p className="text-xl">您正在 {tableId} 号桌</p>
        </div>
      </div>
      
      {/* 主要内容 */}
      <div className="flex-1 max-w-md mx-auto w-full p-6">
        <div className="bg-white rounded-xl shadow-xl p-6 -mt-10">
          {isRedirecting ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">{countdown}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">正在跳转到菜单</h2>
              <p className="text-gray-600">请稍候，即将开始您的用餐体验</p>
              
              <Link href={`/menu?table=${tableId}`} className="mt-6 inline-block text-amber-600">
                点击立即前往
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-amber-600">{tableId}</span>
                </div>
                <h2 className="text-xl font-bold">欢迎光临</h2>
                <p className="text-gray-600 mt-1">您可以通过手机直接点餐</p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleStartOrdering}
                  className="w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                >
                  开始点餐
                </button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>如需服务员协助，请呼叫服务员</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* 特色信息 */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium">快速下单</h3>
            <p className="text-xs text-gray-500 mt-1">无需等待服务员</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium">在线支付</h3>
            <p className="text-xs text-gray-500 mt-1">方便快捷安全</p>
          </div>
        </div>
      </div>
      
      {/* 底部 */}
      <div className="py-4 bg-white">
        <div className="text-center text-sm text-gray-500">
          <p>Table Tap 智能点餐系统</p>
          <p className="text-xs mt-1">© 2023 Table Tap. 保留所有权利。</p>
        </div>
      </div>
    </div>
  )
} 