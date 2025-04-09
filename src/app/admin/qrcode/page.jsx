'use client'

import { useState, useRef } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import Button from '@/components/ui/Button'
import {QRCodeSVG} from 'qrcode.react'
import html2canvas from 'html2canvas'

export default function QRCodeGeneratorPage() {
  const [tableNumber, setTableNumber] = useState('')
  const [generatedCodes, setGeneratedCodes] = useState([])
  const [error, setError] = useState('')
  const qrCodeRef = useRef(null)
  
  // 生成二维码的URL
  const generateQRCodeUrl = (tableNum) => {
    // 假设应用的URL是相对于当前站点的，您可以修改此部分以适应实际部署情况
    const baseUrl = window.location.origin
    return `${baseUrl}/table/${tableNum}`
  }
  
  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!tableNumber.trim()) {
      setError('请输入桌号')
      return
    }
    
    if (isNaN(tableNumber) || parseInt(tableNumber) <= 0) {
      setError('请输入有效的桌号')
      return
    }
    
    const tableNum = parseInt(tableNumber)
    
    // 检查是否已经生成过此桌号的二维码
    if (generatedCodes.some(code => code.tableNumber === tableNum)) {
      setError('该桌号的二维码已经生成')
      return
    }
    
    // 添加到已生成列表
    setGeneratedCodes([
      ...generatedCodes,
      { 
        tableNumber: tableNum,
        url: generateQRCodeUrl(tableNum),
        createdAt: new Date()
      }
    ])
    
    // 清空输入和错误
    setTableNumber('')
    setError('')
  }
  
  // 生成批量二维码
  const handleBatchGenerate = () => {
    setError('')
    
    const batchStart = generatedCodes.length > 0 
      ? Math.max(...generatedCodes.map(code => code.tableNumber)) + 1 
      : 1
    
    const newCodes = []
    for (let i = 0; i < 5; i++) {
      const tableNum = batchStart + i
      newCodes.push({
        tableNumber: tableNum,
        url: generateQRCodeUrl(tableNum),
        createdAt: new Date()
      })
    }
    
    setGeneratedCodes([...generatedCodes, ...newCodes])
  }
  
  // 下载二维码
  const handleDownload = async (code, index) => {
    const element = document.getElementById(`qrcode-${index}`)
    
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 3 })
        
        // 创建下载链接
        const link = document.createElement('a')
        link.download = `桌号${code.tableNumber}二维码.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } catch (error) {
        console.error('下载二维码出错:', error)
        setError('下载二维码时出错')
      }
    }
  }
  
  // 清除所有二维码
  const handleClearAll = () => {
    setGeneratedCodes([])
  }
  
  // 下载所有二维码为PDF（此功能需要额外的库支持，如jspdf）
  const handleDownloadAll = () => {
    alert('批量下载功能正在开发中')
  }
  
  // 格式化日期
  const formatDate = (date) => {
    return new Date(date).toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">桌号二维码管理</h1>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleBatchGenerate}
              disabled={generatedCodes.length >= 50}
            >
              批量生成5个
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownloadAll}
              disabled={generatedCodes.length === 0}
            >
              下载全部
            </Button>
            
            <Button 
              variant="outline"
              className="text-red-600 hover:bg-red-50"
              onClick={handleClearAll}
              disabled={generatedCodes.length === 0}
            >
              清空
            </Button>
          </div>
        </div>
        
        {/* 生成表单 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">生成二维码</h2>
          
          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div className="flex-1">
              <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                桌号
              </label>
              <input
                id="tableNumber"
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="请输入桌号"
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            
            <Button type="submit">
              生成二维码
            </Button>
          </form>
        </div>
        
        {/* 二维码列表 */}
        {generatedCodes.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">已生成的二维码 ({generatedCodes.length})</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {generatedCodes.map((code, index) => (
                <div key={index} className="border rounded-lg p-4 flex flex-col items-center">
                  <div 
                    id={`qrcode-${index}`} 
                    ref={index === 0 ? qrCodeRef : null}
                    className="bg-white p-4 rounded-lg"
                  >
                    <div className="text-center mb-2 font-bold text-lg">桌号 {code.tableNumber}</div>
                    <QRCodeSVG 
                      value={code.url} 
                      size={180} 
                      level="H"
                      renderAs="svg"
                      includeMargin={true}
                      className="border p-2 rounded"
                      imageSettings={{
                        // 如果logo存在就使用，否则不显示logo
                        src: '/favicon.ico',
                        height: 24,
                        width: 24,
                        excavate: true
                      }}
                    />
                    <div className="text-center mt-2 text-xs text-gray-500">扫码点餐</div>
                  </div>
                  
                  <div className="mt-3 w-full">
                    <p className="text-sm text-gray-500 text-center mb-2">
                      创建于 {formatDate(code.createdAt)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDownload(code, index)}
                    >
                      下载
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 