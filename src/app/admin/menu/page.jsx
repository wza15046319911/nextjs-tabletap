'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SafeImage from '@/components/ui/SafeImage'
import AdminLayout from '@/components/layout/AdminLayout'
import Loading from '@/components/ui/Loading'
import Button from '@/components/ui/Button'

export default function AdminMenuPage() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // 模拟获取分类和菜单数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 模拟分类数据
        const categoriesData = [
          { id: 1, name: '咖啡', displayOrder: 1 },
          { id: 2, name: '茶', displayOrder: 2 },
          { id: 3, name: '甜点', displayOrder: 3 },
          { id: 4, name: '简餐', displayOrder: 4 },
        ]
        
        // 模拟菜单数据
        const menuItemsData = [
          { 
            id: 1, 
            name: '美式咖啡', 
            description: '醇厚的经典美式咖啡', 
            price: 18.00, 
            imageUrl: 'https://placehold.co/600x400?text=美式咖啡', 
            categoryId: 1,
            isAvailable: true,
            displayOrder: 1
          },
          { 
            id: 2, 
            name: '拿铁', 
            description: '丝滑浓郁的拿铁咖啡', 
            price: 22.00, 
            imageUrl: 'https://placehold.co/600x400?text=拿铁', 
            categoryId: 1,
            isAvailable: true,
            displayOrder: 2
          },
          { 
            id: 3, 
            name: '卡布奇诺', 
            description: '经典意式卡布奇诺', 
            price: 24.00, 
            imageUrl: 'https://placehold.co/600x400?text=卡布奇诺', 
            categoryId: 1,
            isAvailable: true,
            displayOrder: 3
          },
          { 
            id: 4, 
            name: '抹茶拿铁', 
            description: '日式抹茶与牛奶的完美融合', 
            price: 26.00, 
            imageUrl: 'https://placehold.co/600x400?text=抹茶拿铁', 
            categoryId: 2,
            isAvailable: true,
            displayOrder: 1
          },
          { 
            id: 5, 
            name: '红茶拿铁', 
            description: '锡兰红茶配以新鲜牛奶', 
            price: 24.00, 
            imageUrl: 'https://placehold.co/600x400?text=红茶拿铁', 
            categoryId: 2,
            isAvailable: true,
            displayOrder: 2
          },
          { 
            id: 6, 
            name: '提拉米苏', 
            description: '意大利经典甜点', 
            price: 32.00, 
            imageUrl: 'https://placehold.co/600x400?text=提拉米苏', 
            categoryId: 3,
            isAvailable: true,
            displayOrder: 1
          },
          { 
            id: 7, 
            name: '奶油蛋糕', 
            description: '轻盈松软的奶油蛋糕', 
            price: 28.00, 
            imageUrl: 'https://placehold.co/600x400?text=奶油蛋糕', 
            categoryId: 3,
            isAvailable: false,
            displayOrder: 2
          },
          { 
            id: 8, 
            name: '意面套餐', 
            description: '经典意大利面配沙拉', 
            price: 42.00, 
            imageUrl: 'https://placehold.co/600x400?text=意面套餐', 
            categoryId: 4,
            isAvailable: true,
            displayOrder: 1
          },
        ]
        
        setCategories(categoriesData)
        setMenuItems(menuItemsData)
        
        // 默认选择第一个分类
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id)
        }
        
      } catch (error) {
        console.error('获取菜单数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // 处理分类切换
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId)
  }
  
  // 筛选当前分类的菜单项
  const filteredMenuItems = activeCategory
    ? menuItems.filter(item => item.categoryId === activeCategory)
    : menuItems
  
  // 处理添加菜单项
  const handleAddMenuItem = () => {
    setShowAddModal(true)
  }
  
  // 处理编辑菜单项
  const handleEditMenuItem = (itemId) => {
    router.push(`/admin/menu/${itemId}`)
  }
  
  // 处理隐藏/显示菜单项
  const handleToggleAvailability = (itemId) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, isAvailable: !item.isAvailable } 
          : item
      )
    )
  }
  
  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">菜单管理</h1>
          
          <Button onClick={handleAddMenuItem}>
            添加菜品
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Button>
        </div>
        
        {loading ? (
          <Loading />
        ) : (
          <div>
            {/* 分类切换 */}
            <div className="flex overflow-x-auto pb-2 mb-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap mr-2 ${
                    activeCategory === category.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {/* 菜单列表 */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">菜单项列表</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        菜品
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        描述
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        价格
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMenuItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          该分类暂无菜品
                        </td>
                      </tr>
                    ) : (
                      filteredMenuItems.map(item => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                                {item.imageUrl ? (
                                  <SafeImage
                                    src={item.imageUrl}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-500">
                                    无图
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">分类: {categories.find(c => c.id === item.categoryId)?.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{item.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">¥{item.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.isAvailable ? '上架中' : '已下架'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleEditMenuItem(item.id)}
                              className="text-amber-600 hover:text-amber-900 mr-4"
                            >
                              编辑
                            </button>
                            <button 
                              onClick={() => handleToggleAvailability(item.id)}
                              className={item.isAvailable ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                            >
                              {item.isAvailable ? '下架' : '上架'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* 添加菜品模态框 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">添加菜品</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="p-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    菜品名称
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="请输入菜品名称"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    所属分类
                  </label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    价格 (¥)
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="请输入菜品描述"
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    图片
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none">
                          <span>上传图片</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">或拖拽图片到此处</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF 最大 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="available"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    defaultChecked
                  />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                    立即上架
                  </label>
                </div>
                
                <div className="flex justify-end pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md mr-2 hover:bg-gray-200"
                    onClick={() => setShowAddModal(false)}
                  >
                    取消
                  </button>
                  <Button type="submit">
                    保存
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 