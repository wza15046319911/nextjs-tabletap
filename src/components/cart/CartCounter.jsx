'use client'

import React from 'react'
import Link from 'next/link'

export default function CartCounter({ count = 0, total = 0, tableId }) {
  // 确保count和total有默认值或转换为数字
  const itemCount = typeof count === 'number' ? count : 0
  const cartTotal = typeof total === 'number' ? total : 0
  
  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
      <Link 
        href={`/cart?table=${tableId}`}
        className="flex items-center justify-between bg-amber-600 text-white rounded-lg px-4 py-3 w-full"
        aria-label={`查看购物车, 共${itemCount}件商品，合计${cartTotal.toFixed(2)}元`}
      >
        <div className="flex items-center">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>
          </div>
          <span className="ml-3 font-medium">查看购物车</span>
        </div>
        <div className="font-bold">¥{cartTotal.toFixed(2)}</div>
      </Link>
    </div>
  )
} 