'use client'

import React from 'react'

const buttonVariants = {
  primary: 'bg-amber-600 hover:bg-amber-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  outline: 'bg-transparent border border-amber-600 text-amber-600 hover:bg-amber-50',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const buttonSizes = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4',
  lg: 'py-3 px-6 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        ${buttonVariants[variant]} 
        ${buttonSizes[size]}
        rounded-lg font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
} 