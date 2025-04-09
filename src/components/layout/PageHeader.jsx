'use client'

import React from 'react'
import Link from 'next/link'

export default function PageHeader({ title, backUrl, children }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm">
      {backUrl && (
        <Link 
          href={backUrl} 
          className="mr-3 text-gray-600 hover:text-gray-900"
          aria-label="返回"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      )}
      
      <h1 className="text-lg font-bold flex-1 truncate">{title}</h1>
      
      {children}
    </header>
  )
} 