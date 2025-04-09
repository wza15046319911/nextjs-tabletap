'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Button from '../ui/Button'

export default function MenuItemDetail({ item, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [notes, setNotes] = useState('')
  
  // 计算总价
  const calculateTotal = () => {
    let total = Number(item.price) * quantity
    
    // 添加选项价格
    if (item.optionGroups) {
      item.optionGroups.forEach(group => {
        const selectedIds = selectedOptions[group.id] || []
        group.options.forEach(option => {
          if (selectedIds.includes(option.id)) {
            total += Number(option.price) * quantity
          }
        })
      })
    }
    
    return total.toFixed(2)
  }
  
  // 处理选项选择
  const handleOptionChange = (groupId, optionId, isMultiple) => {
    setSelectedOptions(prev => {
      const currentSelected = prev[groupId] || []
      
      // 单选处理
      if (!isMultiple) {
        return {
          ...prev,
          [groupId]: [optionId]
        }
      }
      
      // 多选处理
      if (currentSelected.includes(optionId)) {
        return {
          ...prev,
          [groupId]: currentSelected.filter(id => id !== optionId)
        }
      } else {
        return {
          ...prev,
          [groupId]: [...currentSelected, optionId]
        }
      }
    })
  }
  
  // 添加到购物车
  const handleAddToCart = () => {
    // 格式化选项
    const formattedOptions = item.optionGroups ? item.optionGroups.map(group => {
      const selectedIds = selectedOptions[group.id] || []
      const selectedOptionsForGroup = group.options
        .filter(option => selectedIds.includes(option.id))
        .map(option => ({
          id: option.id,
          name: option.name,
          price: option.price
        }))
      
      return {
        id: group.id,
        name: group.name,
        options: selectedOptionsForGroup
      }
    }).filter(group => group.options.length > 0) : []
    
    onAddToCart({
      ...item,
      quantity,
      selectedOptions: formattedOptions,
      notes
    })
    
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="relative h-48 w-full">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover rounded-t-lg"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-t-lg">
              <span className="text-gray-400">暂无图片</span>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
            aria-label="关闭"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 内容 */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-1">{item.name}</h2>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="text-amber-600 font-bold text-lg mb-4">¥{item.price}</div>
          
          {/* 选项组 */}
          {item.optionGroups && item.optionGroups.length > 0 && (
            <div className="space-y-4 mb-4">
              {item.optionGroups.map(group => (
                <div key={group.id} className="border-t pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{group.name}</h3>
                    {group.isRequired && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">必选</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {group.options.map(option => (
                      <div key={option.id} className="flex items-center">
                        <input
                          type={group.maxSelect === 1 ? "radio" : "checkbox"}
                          id={`option-${option.id}`}
                          name={`group-${group.id}`}
                          checked={(selectedOptions[group.id] || []).includes(option.id)}
                          onChange={() => handleOptionChange(
                            group.id, 
                            option.id, 
                            group.maxSelect > 1
                          )}
                          className="mr-2"
                        />
                        <label 
                          htmlFor={`option-${option.id}`}
                          className="flex-1 flex justify-between"
                        >
                          <span>{option.name}</span>
                          {Number(option.price) > 0 && (
                            <span className="text-amber-600">+¥{Number(option.price).toFixed(2)}</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* 备注 */}
          <div className="mb-4">
            <label htmlFor="notes" className="block mb-1 font-medium">备注</label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="如有特殊要求请在此注明"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={2}
            />
          </div>
          
          {/* 数量 */}
          <div className="flex items-center justify-between mb-6">
            <div className="font-medium">数量</div>
            <div className="flex items-center">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center border rounded-l-lg"
                aria-label="减少数量"
              >
                -
              </button>
              <span className="w-10 text-center border-t border-b h-8 leading-8">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="w-8 h-8 flex items-center justify-center border rounded-r-lg"
                aria-label="增加数量"
              >
                +
              </button>
            </div>
          </div>
          
          {/* 添加到购物车 */}
          <Button onClick={handleAddToCart} className="w-full" size="lg">
            加入购物车 ¥{calculateTotal()}
          </Button>
        </div>
      </div>
    </div>
  )
} 