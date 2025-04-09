'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from "next/image"
import Loading from '@/components/ui/Loading'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableId = searchParams.get('table')
  
  useEffect(() => {
    // 如果有桌号参数，直接跳转到菜单页
    if (tableId) {
      router.push(`/menu?table=${tableId}`)
    }
  }, [tableId, router])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-amber-600 mb-4">Table Tap</h1>
        <p className="text-gray-600 mb-8">智能咖啡厅点餐系统</p>
        
        {tableId ? (
          <Loading text="正在为您跳转到菜单..." />
        ) : (
          <div className="space-y-4">
            <p className="text-lg font-medium">欢迎使用Table Tap</p>
            <p className="text-gray-600">
              请扫描您餐桌上的二维码，开始您的点餐体验
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium transition-colors hover:bg-amber-700"
              >
                员工登录
              </a>
              <a
                href="/menu?table=1"
                className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium transition-colors hover:bg-gray-200"
              >
                演示体验
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
