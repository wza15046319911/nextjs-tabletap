'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PageHeader from '@/components/layout/PageHeader'
import CategoryList from '@/components/menu/CategoryList'
import MenuItemCard from '@/components/menu/MenuItemCard'
import MenuItemDetail from '@/components/menu/MenuItemDetail'
import CartCounter from '@/components/cart/CartCounter'
import Loading from '@/components/ui/Loading'
import { menuAPI, cartAPI } from '@/services/api'

export default function MenuPage() {
  const searchParams = useSearchParams()
  const tableId = searchParams.get('table')
  const sessionId = 'guest-session' // 默认会话ID
  
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cart, setCart] = useState({ id: 0, items: [], total: 0, itemCount: 0 })
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  
  // 获取分类
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await menuAPI.getCategories()
        setCategories(data)
        
        // 默认选择第一个分类
        if (data.length > 0) {
          setActiveCategory(data[0].id)
        }
      } catch (err) {
        console.error('获取分类失败', err)
        setError('无法加载菜单分类，请重试')
      }
    }
    
    fetchCategories()
  }, [])
  
  // 获取菜单项
  useEffect(() => {
    async function fetchMenuItems() {
      if (!activeCategory) return
      
      setLoading(true)
      try {
        const data = await menuAPI.getMenuItems(activeCategory)
        setMenuItems(data)
      } catch (err) {
        console.error('获取菜单项失败', err)
        setError('无法加载菜单项，请重试')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMenuItems()
  }, [activeCategory])
  
  // 获取购物车
  useEffect(() => {
    if (!tableId) return
    
    async function fetchCart() {
      setCartLoading(true)
      try {
        const cartData = await cartAPI.getCart(tableId, sessionId)
        setCart(cartData)
      } catch (err) {
        console.error('获取购物车失败', err)
        // 设置一个空购物车
        setCart({ id: 0, items: [], total: 0, itemCount: 0 })
      } finally {
        setCartLoading(false)
      }
    }
    
    fetchCart()
  }, [tableId, sessionId])
  
  // 打开菜单项详情
  const handleItemClick = async (item) => {
    // 如果菜品有自定义选项，则加载详情
    setDetailLoading(true)
    try {
      const detailedItem = await menuAPI.getMenuItem(item.id)
      setSelectedItem(detailedItem)
    } catch (err) {
      console.error('获取菜品详情失败', err)
      // 如果加载失败，直接使用现有数据
      setSelectedItem(item)
    } finally {
      setDetailLoading(false)
    }
  }
  
  // 关闭菜单项详情
  const handleCloseDetail = () => {
    setSelectedItem(null)
  }
  
  // 添加到购物车
  const handleAddToCart = async (item) => {
    if (!cart.id && cart.id !== 0) {
      console.error('购物车ID不存在')
      return
    }
    
    try {
      const itemOptions = item.selectedOptions || []
      const requestData = {
        cartId: cart.id,
        menuItemId: item.id,
        quantity: item.quantity || 1,
        options: itemOptions,
        notes: item.notes || ''
      }
      
      await cartAPI.addToCart(requestData)
      
      // 重新获取购物车
      const updatedCart = await cartAPI.getCart(tableId, sessionId)
      setCart(updatedCart)
    } catch (err) {
      console.error('添加到购物车失败', err)
      alert('添加到购物车失败，请重试')
    }
  }
  
  // 切换分类
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId)
  }
  
  if (!tableId) {
    return (
      <div className="min-h-screen flex flex-col">
        <PageHeader title="菜单" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">无法访问菜单</h2>
            <p className="text-gray-600">请扫描餐桌上的二维码访问菜单</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col pb-24">
      <PageHeader title="菜单" />
      
      {/* 分类列表 */}
      <div className="px-4">
        <CategoryList 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelectCategory={handleCategoryChange} 
        />
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="p-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      )}
      
      {/* 加载中 */}
      {loading ? (
        <Loading />
      ) : (
        /* 菜品列表 */
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              该分类暂无菜品
            </div>
          ) : (
            menuItems.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onAddToCart={handleAddToCart} 
                onClick={() => handleItemClick(item)}
              />
            ))
          )}
        </div>
      )}
      
      {/* 购物车计数器 */}
      {!cartLoading && (
        <CartCounter 
          count={cart.itemCount} 
          total={Number(cart.total)} 
          tableId={tableId} 
        />
      )}
      
      {/* 菜品详情弹窗 */}
      {selectedItem && !detailLoading && (
        <MenuItemDetail 
          item={selectedItem} 
          onClose={handleCloseDetail} 
          onAddToCart={handleAddToCart} 
        />
      )}
      
      {/* 详情加载中 */}
      {detailLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8">
            <Loading text="正在加载详情..." />
          </div>
        </div>
      )}
    </div>
  )
} 