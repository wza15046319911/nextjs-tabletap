// API服务封装

// 基本请求函数
async function fetchAPI(endpoint, options = {}) {
  const baseUrl = '/api';
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '请求失败');
    }
    
    return data;
  } catch (error) {
    console.error(`API请求错误 ${url}:`, error);
    throw error;
  }
}

// 菜单相关API
export const menuAPI = {
  // 获取所有分类
  getCategories: () => fetchAPI('/categories'),
  
  // 获取菜单项
  getMenuItems: (categoryId = null) => {
    const endpoint = categoryId ? `/menu-items?category=${categoryId}` : '/menu-items';
    return fetchAPI(endpoint);
  },
  
  // 获取单个菜单项详情
  getMenuItem: (id) => fetchAPI(`/menu-items/${id}`),
};

// 购物车相关API
export const cartAPI = {
  // 获取购物车
  getCart: (tableId, sessionId = 'guest-session') => {
    let endpoint = '/cart';
    if (tableId) endpoint += `?table=${tableId}`;
    if (sessionId) endpoint += `${tableId ? '&' : '?'}session=${sessionId}`;
    return fetchAPI(endpoint);
  },
  
  // 添加商品到购物车
  addToCart: (item) => fetchAPI('/cart/items', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  
  // 从购物车中移除商品
  removeFromCart: (itemId) => fetchAPI(`/cart/items/${itemId}`, {
    method: 'DELETE',
  }),
  
  // 更新购物车商品数量
  updateCartItem: (itemId, quantity) => fetchAPI(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  }),
  
  // 清空购物车
  clearCart: (cartId) => fetchAPI(`/cart?id=${cartId}`, {
    method: 'DELETE',
  }),
};

// 订单相关API
export const orderAPI = {
  // 创建订单
  async createOrder(orderData) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '创建订单失败');
    }
    
    return response.json();
  },
  
  // 获取订单详情
  async getOrder(orderId) {
    const response = await fetch(`/api/orders/${orderId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '获取订单失败');
    }
    
    return response.json();
  }
};

// 支付相关API
export const paymentAPI = {
  // 处理支付
  async processPayment(paymentData) {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '支付处理失败');
    }
    
    return response.json();
  }
};

// 认证相关API
export const authAPI = {
  // 用户注册
  async register(userData) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '注册失败');
    }
    
    return data;
  },
  
  // 用户登录
  async login(credentials) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '登录失败');
    }
    
    return data;
  },
  
  // 用户登出
  async logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '登出失败');
    }
    
    return data;
  },
  
  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        if (response.status === 401) {
          return { isAuthenticated: false };
        }
        const error = await response.json();
        throw new Error(error.error || '获取用户信息失败');
      }
      
      const data = await response.json();
      return {
        isAuthenticated: true,
        user: data.user
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return { isAuthenticated: false };
    }
  }
}; 