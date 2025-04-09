'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import { cartAPI } from '@/services/api'

export default function CartPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tableId = searchParams.get('table')
  const sessionId = 'guest-session'
  
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // 获取购物车数据
  useEffect(() => {
    if (!tableId) return
    
    async function fetchCart() {
      setLoading(true)
      try {
        const cartData = await cartAPI.getCart(tableId, sessionId)
        setCart(cartData)
      } catch (err) {
        console.error('获取购物车失败', err)
        setError('获取购物车失败，请重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCart()
  }, [tableId, sessionId])
  
  // 更新商品数量
  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await cartAPI.updateCartItem(itemId, newQuantity)
      
      // 重新获取购物车
      const updatedCart = await cartAPI.getCart(tableId, sessionId)
      setCart(updatedCart)
    } catch (err) {
      console.error('更新商品数量失败', err)
      setError('更新商品数量失败，请重试')
    }
  }
  
  // 删除商品
  const handleRemoveItem = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId)
      
      // 重新获取购物车
      const updatedCart = await cartAPI.getCart(tableId, sessionId)
      setCart(updatedCart)
    } catch (err) {
      console.error('删除商品失败', err)
      setError('删除商品失败，请重试')
    }
  }
  
  // 清空购物车
  const handleClearCart = async () => {
    if (!cart || !cart.id) return
    
    try {
      await cartAPI.clearCart(cart.id)
      
      // 重新获取购物车
      const updatedCart = await cartAPI.getCart(tableId, sessionId)
      setCart(updatedCart)
    } catch (err) {
      console.error('清空购物车失败', err)
      setError('清空购物车失败，请重试')
    }
  }
  
  // 前往结账
  const handleCheckout = () => {
    router.push(`/checkout?table=${tableId}`)
  }
  
  // 继续点餐
  const handleContinueShopping = () => {
    router.push(`/menu?table=${tableId}`)
  }
  
  if (!tableId) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="购物车" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-amber-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">无法访问购物车</h2>
            <p className="text-gray-600 mb-6">请扫描餐桌上的二维码访问菜单</p>
            <Button onClick={() => router.push('/')}>返回首页</Button>
          </div>
        </div>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="购物车" backUrl={`/menu?table=${tableId}`} />
        <Loading />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="购物车" backUrl={`/menu?table=${tableId}`} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">出错了</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>重试</Button>
          </div>
        </div>
      </div>
    )
  }
  
  // 购物车为空
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="购物车" backUrl={`/menu?table=${tableId}`} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">购物车为空</h2>
            <p className="text-gray-600 mb-6">前往菜单页添加美味菜品吧</p>
            <Button onClick={handleContinueShopping}>去点餐</Button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col pb-32">
      <PageHeader title="购物车" backUrl={`/menu?table=${tableId}`} />
      
      {/* 购物车列表 */}
      <div className="flex-1">
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold">已选商品</h2>
              <button 
                onClick={handleClearCart} 
                className="text-sm text-gray-500 hover:text-red-600"
                aria-label="清空购物车"
              >
                清空
              </button>
            </div>
            
            {/* 购物车商品列表 */}
            <ul className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      
                      {/* 自定义选项 */}
                      {item.options && item.options.length > 0 && (
                        <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-1">
                          {item.options.map((option, index) => (
                            <span key={index} className="inline-block bg-gray-100 rounded px-1 text-xs">
                              {option.name}{option.price > 0 ? ` +¥${option.price}` : ''}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* 备注 */}
                      {item.notes && (
                        <div className="mt-1 text-sm text-gray-500">
                          备注: {item.notes}
                        </div>
                      )}
                      
                      <div className="mt-2 text-amber-600 font-bold">
                        ¥{Number(item.price).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-end flex-col justify-between">
                      {/* 数量调整 */}
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center border rounded-l-lg"
                          aria-label="减少数量"
                        >
                          -
                        </button>
                        <span className="w-8 text-center border-t border-b h-8 leading-8">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-r-lg"
                          aria-label="增加数量"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* 删除按钮 */}
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="mt-2 text-sm text-gray-500 hover:text-red-600"
                        aria-label="删除商品"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* 结算栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-600">合计:</div>
          <div className="text-lg font-bold text-amber-600">¥{Number(cart.total).toFixed(2)}</div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleContinueShopping}
            className="flex-1"
          >
            继续点餐
          </Button>
          
          <Button
            onClick={handleCheckout}
            className="flex-1"
          >
            去结账
          </Button>
        </div>
      </div>
    </div>
  )
} 