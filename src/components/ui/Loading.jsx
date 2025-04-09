'use client'

import React from 'react'

export default function Loading({ text = '加载中...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-full min-h-[200px]" role="status">
      <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-amber-600 animate-spin"></div>
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  )
} 