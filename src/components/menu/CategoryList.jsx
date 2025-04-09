'use client'

import React from 'react'

export default function CategoryList({ categories, activeCategory, onSelectCategory }) {
  return (
    <nav className="overflow-x-auto" aria-label="菜单分类">
      <ul className="flex space-x-2 py-2 px-1 min-w-full whitespace-nowrap">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeCategory === category.id 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }
              `}
              onClick={() => onSelectCategory(category.id)}
              aria-current={activeCategory === category.id ? 'true' : 'false'}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
} 