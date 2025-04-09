import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

// 需要认证才能访问的路由
const AUTH_ROUTES = [
  '/profile',
  '/my-orders',
  '/account'
]

// 不需要认证的路由，认证后不应访问的路由
const PUBLIC_ROUTES = [
  '/login',
  '/register'
]

// JWT秘钥
const JWT_SECRET = process.env.JWT_SECRET || 'table-tap-secret-key'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  
  // 获取认证令牌
  const token = request.cookies.get('auth_token')?.value
  
  // 检查是否需要认证
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  
  try {
    // 验证令牌
    if (token) {
      // 尝试验证令牌
      try {
        const encoder = new TextEncoder()
        await jwtVerify(token, encoder.encode(JWT_SECRET))
        
        // 令牌有效，如果访问的是公共路由（如登录），重定向到首页
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url))
        }
      } catch (error) {
        // 令牌无效，需要清除
        const response = NextResponse.next()
        response.cookies.set({
          name: 'auth_token',
          value: '',
          httpOnly: true,
          path: '/',
          expires: new Date(0),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        })
        
        // 如果是需要认证的路由，重定向到登录页面
        if (isAuthRoute) {
          return NextResponse.redirect(
            new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
          )
        }
        
        return response
      }
    } else if (isAuthRoute) {
      // 没有令牌但访问需要认证的路由，重定向到登录页面
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      )
    }
  } catch (error) {
    console.error('中间件错误:', error)
  }
  
  return NextResponse.next()
}

// 配置要应用中间件的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * - api 路由
     * - 静态文件路由
     * - _next 相关路由
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 