'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [logoutLoading, setLogoutLoading] = useState(false)
  
  // 如果用户未登录，在加载完成后重定向到登录页
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile')
    }
  }, [user, loading, router])
  
  // 处理登出
  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      setLogoutLoading(false)
    }
  }
  
  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="个人中心" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader title="个人中心" />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">账户信息</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  用户名
                </label>
                <div className="font-medium">{user.name}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  邮箱
                </label>
                <div className="font-medium">{user.email}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  账户类型
                </label>
                <div className="font-medium">
                  {user.role === 'admin' ? '管理员' : user.role === 'staff' ? '员工' : '顾客'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  注册时间
                </label>
                <div className="font-medium">
                  {new Date(user.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button onClick={() => router.push('/my-orders')} variant="outline">
              我的订单
            </Button>
            
            <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              {logoutLoading ? '登出中...' : '退出登录'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 