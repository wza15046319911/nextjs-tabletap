'use client'

import React, { useState } from 'react'
import Button from '../ui/Button'

export default function CreditCardForm({ amount, onSubmit, disabled = false }) {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value
    
    // 格式化卡号 (每4位数字后添加空格)
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '') // 移除所有空格
        .replace(/\D/g, '') // 只保留数字
        .replace(/(\d{4})(?=\d)/g, '$1 ') // 每4位添加空格
        .substring(0, 19) // 限制长度 (16位数字 + 3个空格)
    }
    
    // 格式化过期日期 (MM/YY格式)
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '') // 只保留数字
        .replace(/^(\d{2})(\d)/g, '$1/$2') // 添加斜杠
        .substring(0, 5) // 限制长度 (MM/YY)
    }
    
    // 格式化CVV (只允许3-4位数字)
    if (name === 'cvv') {
      formattedValue = value
        .replace(/\D/g, '') // 只保留数字
        .substring(0, 4) // 限制长度
    }
    
    setCardInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }))
    
    // 清除该字段的错误提示
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  // 表单验证
  const validateForm = () => {
    const newErrors = {}
    
    // 验证卡号
    if (!cardInfo.cardNumber.trim()) {
      newErrors.cardNumber = '请输入卡号'
    } else if (cardInfo.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = '请输入有效的卡号'
    }
    
    // 验证持卡人
    if (!cardInfo.cardHolder.trim()) {
      newErrors.cardHolder = '请输入持卡人姓名'
    }
    
    // 验证过期日期
    if (!cardInfo.expiryDate) {
      newErrors.expiryDate = '请输入过期日期'
    } else if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate)) {
      newErrors.expiryDate = '格式无效，请使用MM/YY格式'
    } else {
      const [month, year] = cardInfo.expiryDate.split('/')
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100 // 获取后两位数字
      const currentMonth = currentDate.getMonth() + 1 // 1-12
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = '月份无效'
      } else if (
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = '卡片已过期'
      }
    }
    
    // 验证CVV
    if (!cardInfo.cvv) {
      newErrors.cvv = '请输入CVV'
    } else if (cardInfo.cvv.length < 3) {
      newErrors.cvv = 'CVV无效'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // 表单提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (disabled || isSubmitting) return
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      await onSubmit({
        cardNumber: cardInfo.cardNumber.replace(/\s/g, ''),
        cardHolder: cardInfo.cardHolder,
        expiryDate: cardInfo.expiryDate,
        cvv: cardInfo.cvv
      })
    } catch (error) {
      console.error('支付失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-lg mx-auto w-full">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg text-white mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm opacity-80">金额</p>
            <p className="text-2xl font-bold">¥{(amount || 0).toFixed(2)}</p>
          </div>
          <div className="rounded-md bg-white/20 backdrop-blur-sm p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
        </div>
        
        <div className="font-mono text-xl tracking-wider mb-6">
          {cardInfo.cardNumber || '•••• •••• •••• ••••'}
        </div>
        
        <div className="flex justify-between">
          <div>
            <p className="text-xs opacity-80">持卡人</p>
            <p className="font-semibold">{cardInfo.cardHolder || '姓名'}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">有效期</p>
            <p className="font-semibold">{cardInfo.expiryDate || 'MM/YY'}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block mb-1 font-medium">
            卡号
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardInfo.cardNumber}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-amber-500`}
            disabled={disabled}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-red-500 text-sm">{errors.cardNumber}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="cardHolder" className="block mb-1 font-medium">
            持卡人姓名
          </label>
          <input
            type="text"
            id="cardHolder"
            name="cardHolder"
            placeholder="张三"
            value={cardInfo.cardHolder}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.cardHolder ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-amber-500`}
            disabled={disabled}
          />
          {errors.cardHolder && (
            <p className="mt-1 text-red-500 text-sm">{errors.cardHolder}</p>
          )}
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="expiryDate" className="block mb-1 font-medium">
              有效期
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={cardInfo.expiryDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-amber-500`}
              disabled={disabled}
            />
            {errors.expiryDate && (
              <p className="mt-1 text-red-500 text-sm">{errors.expiryDate}</p>
            )}
          </div>
          
          <div className="w-1/3">
            <label htmlFor="cvv" className="block mb-1 font-medium">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              placeholder="123"
              value={cardInfo.cvv}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-amber-500`}
              disabled={disabled}
            />
            {errors.cvv && (
              <p className="mt-1 text-red-500 text-sm">{errors.cvv}</p>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full py-4 text-lg"
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? '处理中...' : `支付 ¥${(amount || 0).toFixed(2)}`}
          </Button>
        </div>
      </form>
    </div>
  )
} 