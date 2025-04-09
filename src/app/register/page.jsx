'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const { register, login } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 表单验证
    if (!email || !password || !confirmPassword) {
      setError('请填写所有必填字段')
      return
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }
    
    // 密码长度验证
    if (password.length < 6) {
      setError('密码长度至少为6个字符')
      return
    }
    
    // 密码匹配验证
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // 注册
      const registerResult = await register(email, password)
      
      if (registerResult.success) {
        // 注册成功后自动登录
        const loginResult = await login(email, password)
        
        if (loginResult.success) {
          router.push('/')
        } else {
          // 注册成功但登录失败，引导用户去登录页
          router.push('/login')
        }
      } else {
        setError(registerResult.error || '注册失败，请重试')
      }
    } catch (err) {
      setError('注册过程中出现错误，请重试')
      console.error('注册错误:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">注册</h1>
          <p className="text-gray-600">创建您的账户</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="your@email.com"
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="至少6个字符"
              minLength={6}
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
              确认密码
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="再次输入密码"
              disabled={loading}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            已有账户? {' '}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 