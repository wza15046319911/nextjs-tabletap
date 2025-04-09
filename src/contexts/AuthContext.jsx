'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '@/services/api'

// 创建认证上下文
const AuthContext = createContext()

// 认证提供者组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // 初始化时检查用户状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true)
      try {
        const { isAuthenticated, user } = await authAPI.getCurrentUser()
        setIsAuthenticated(isAuthenticated)
        setUser(user || null)
      } catch (error) {
        console.error('认证状态检查失败:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuthStatus()
  }, [])
  
  // 注册
  const register = async (email, password) => {
    setLoading(true)
    try {
      const response = await authAPI.register({ email, password })
      return { success: true, user: response.user }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // 登录
  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      setIsAuthenticated(true)
      setUser(response.user)
      return { success: true }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // 登出
  const logout = async () => {
    setLoading(true)
    try {
      await authAPI.logout()
      setIsAuthenticated(false)
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error('登出失败:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }
  
  // 暴露给子组件的值
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout
  }
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// 使用认证上下文的钩子
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用')
  }
  return context
} 