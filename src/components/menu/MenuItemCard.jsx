'use client'

import React from 'react'
import Image from 'next/image'
import Button from '../ui/Button'

export default function MenuItemCard({ item, onAddToCart, onClick }) {
  return (
    <div 
      className="relative bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      onClick={onClick}  
    >
      <div className="relative h-48 w-full cursor-pointer">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">暂无图片</span>
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">已售罄</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description || '无描述'}</p>
      </div>
      
      <div className="p-4 pt-0 flex items-center justify-between">
        <div className="text-amber-600 font-bold">¥{Number(item.price).toFixed(2)}</div>
        <Button 
          size="sm"
          disabled={!item.isAvailable}
          onClick={(e) => {
            e.stopPropagation(); // 阻止冒泡，防止触发卡片点击
            onAddToCart(item);
          }}
          aria-label={`添加${item.name}到购物车`}
        >
          添加
        </Button>
      </div>
    </div>
  )
} 