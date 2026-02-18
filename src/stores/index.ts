import { defineStore } from 'pinia';
import { fetchProductsFromApi } from '@/lib/productService'; // 导入产品服务

// 商品接口
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  isHot?: boolean
  isNew?: boolean
}

// 购物车商品接口
export interface CartItem extends Product {
  quantity: number
  size?: string
  temperature?: string
}

// 订单接口
export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  createTime: string
  deliveryType: 'pickup' | 'delivery'
  address?: string
}

// 用户接口
export interface User {
  id: string
  name: string
  avatar: string
  phone: string
  level: string
}

// 创建 Pinia Store
export const useMainStore = defineStore('main', {
  state: () => ({
    // 用户信息
    user: null as User | null,
    
    // 购物车
    cart: [] as CartItem[],
    
    // 订单列表
    orders: [] as Order[],
    
    // 收藏商品
    favorites: [] as string[],
    
    // 商品数据
    products: [] as Product[], // 初始化为空数组，等待 API 加载
    loadingProducts: false, // 新增：加载状态
    productsError: null as string | null, // 新增：错误状态
  }),
  
  getters: {
    // 购物车商品总数
    cartItemCount(): number {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    // 购物车总价
    cartTotalPrice(): number {
      return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // 获取收藏商品列表
    favoriteProducts(): Product[] {
      return this.products.filter(product => this.favorites.includes(product.id));
    }
  },
  
  actions: {
    // 加载产品数据
    async loadProducts() {
      this.loadingProducts = true;
      this.productsError = null;
      try {
        const fetchedProducts = await fetchProductsFromApi();
        this.products = fetchedProducts;
      } catch (error: any) {
        this.productsError = error.message || '加载产品数据失败';
        console.error('加载产品数据失败:', error);
        // 在开发阶段，我们可以保留一些默认数据以防 API 出错
        this.products = [
          {
            id: '1',
            name: '美式咖啡',
            description: '经典黑咖啡，浓郁香醇',
            price: 28,
            image: 'https://via.placeholder.com/150',
            category: '咖啡',
            rating: 4.5,
            isHot: true
          }
        ];
      } finally {
        this.loadingProducts = false;
      }
    },

    // 添加商品到购物车
    addToCart(product: Product, quantity: number = 1, size?: string, temperature?: string) {
      const existingItem = this.cart.find(item => item.id === product.id && item.size === size && item.temperature === temperature);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cart.push({
          ...product,
          quantity,
          size,
          temperature
        });
      }
    },
    
    // 从购物车移除商品
    removeFromCart(productId: string, size?: string, temperature?: string) {
      this.cart = this.cart.filter(item => !(item.id === productId && item.size === size && item.temperature === temperature));
    },
    
    // 更新购物车商品数量
    updateCartItemQuantity(productId: string, quantity: number, size?: string, temperature?: string) {
      const item = this.cart.find(cartItem => cartItem.id === productId && cartItem.size === size && cartItem.temperature === temperature);
      if (item) {
        if (quantity <= 0) {
          (this as any).removeFromCart(productId, size, temperature);
        } else {
          item.quantity = quantity;
        }
      }
    },
    
    // 清空购物车
    clearCart() {
      this.cart = [];
    },
    
    // 添加收藏
    addFavorite(productId: string) {
      if (!this.favorites.includes(productId)) {
        this.favorites.push(productId);
      }
    },
    
    // 移除收藏
    removeFavorite(productId: string) {
      this.favorites = this.favorites.filter(id => id !== productId);
    },
    
    // 创建订单
    createOrder(deliveryType: 'pickup' | 'delivery', address?: string): Order {
      const order: Order = {
        id: `order_${Date.now()}`,
        items: [...this.cart],
        total:  (this as any).cartTotalPrice,
        status: 'pending',
        createTime: new Date().toISOString(),
        deliveryType,
        address
      };
      
      this.orders.unshift(order);
       (this as any).clearCart();
      
      return order;
    },
    
    // 更新订单状态
    updateOrderStatus(orderId: string, status: Order['status']) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
    },
    
    // 设置用户信息
    setUser(user: User) {
      this.user = user;
    },
    
    // 登出
    logout() {
      this.user = null;
      // 注意：我们不会清空购物车和其他数据，因为它们会被持久化
    }
  },
  
  persist: {
    key: 'coffee_app_store',
    storage: localStorage,
  }
});

// 保持向后兼容的计算属性和方法（如果需要）
export const cartActions = {
  addToCart: (product: any, quantity: number = 1, size?: string, temperature?: string) => {
    const store:any = useMainStore();
    store.addToCart(product, quantity, size, temperature);
  },
  removeFromCart: (productId: string, size?: string, temperature?: string) => {
    const store:any = useMainStore();
    store.removeFromCart(productId, size, temperature);
  },
  updateQuantity: (productId: string, quantity: number, size?: string, temperature?: string) => {
    const store:any = useMainStore();
    store.updateCartItemQuantity(productId, quantity, size, temperature);
  },
  clearCart: () => {
    const store:any = useMainStore();
    store.clearCart();
  },
  getCartItemCount: () => {
    const store:any = useMainStore();
    return store.cartItemCount;
  },
  getCartTotal: () => {
    const store:any = useMainStore();
    return store.cartTotalPrice;
  }
};

export const favoriteActions = {
  toggleFavorite: (productId: string) => {
    const store:any = useMainStore();
    if (store.favorites.includes(productId)) {
      store.removeFavorite(productId);
    } else {
      store.addFavorite(productId);
    }
  },
  isFavorite: (productId: string) => {
    const store = useMainStore();
    return store.favorites.includes(productId);
  }
};

export const orderActions = {
  createOrder: (deliveryType: 'pickup' | 'delivery', address?: string) => {
    const store:any = useMainStore();
    return store.createOrder(deliveryType, address);
  },
  updateOrderStatus: (orderId: string, status: any) => {
    const store:any = useMainStore();
    store.updateOrderStatus(orderId, status);
  }
};

// 导出一个模拟的 store 对象以保持向后兼容性
export const store = {
  get cart() {
    const mainStore = useMainStore();
    return mainStore.cart;
  },
  get orders() {
    const mainStore = useMainStore();
    return mainStore.orders;
  },
  get favorites() {
    const mainStore = useMainStore();
    return mainStore.favorites;
  },
  get products() {
    const mainStore = useMainStore();
    return mainStore.products;
  },
  get categories() {
    const mainStore = useMainStore();
    const uniqueCategories = new Set(mainStore.products.map(p => p.category));
    return Array.from(uniqueCategories).map((category, index) => ({
      id: index,
      name: category,
      icon: '☕' // 默认图标
    }));
  }
};