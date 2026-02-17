import { defineStore } from 'pinia';

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
    products: [
      {
        id: '1',
        name: '美式咖啡',
        description: '经典美式咖啡，香醇浓郁，回味悠长',
        price: 25,
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=classic%20american%20coffee%20in%20white%20cup%20on%20wooden%20table%20warm%20lighting%20coffee%20beans%20scattered&image_size=square',
        category: '经典咖啡',
        rating: 4.5,
        isHot: true
      },
      {
        id: '2',
        name: '拿铁咖啡',
        description: '香浓牛奶与咖啡的完美融合，口感丝滑',
        price: 32,
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=latte%20coffee%20with%20milk%20foam%20art%20heart%20shape%20in%20ceramic%20cup%20warm%20brown%20background&image_size=square',
        category: '奶咖系列',
        rating: 4.8,
        isHot: true
      },
      {
        id: '3',
        name: '卡布奇诺',
        description: '浓郁咖啡配上绵密奶泡，层次丰富',
        price: 30,
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cappuccino%20coffee%20with%20thick%20milk%20foam%20cinnamon%20powder%20sprinkled%20on%20top%20cozy%20cafe%20atmosphere&image_size=square',
        category: '奶咖系列',
        rating: 4.6
      },
      {
        id: '4',
        name: '焦糖玛奇朵',
        description: '香甜焦糖与浓郁咖啡的甜蜜邂逅',
        price: 35,
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=caramel%20macchiato%20coffee%20with%20caramel%20drizzle%20whipped%20cream%20glass%20cup%20elegant%20presentation&image_size=square',
        category: '特色饮品',
        rating: 4.7,
        isNew: true
      },
      {
        id: '5',
        name: '摩卡咖啡',
        description: '巧克力与咖啡的浪漫组合，甜而不腻',
        price: 38,
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mocha%20coffee%20with%20chocolate%20shavings%20elegant%20presentation%20luxury%20feel%20bright%20interior&image_size=square',
        category: '特色饮品',
        rating: 4.9,
        isHot: true
      },
      {
        id: '6',
        name: '蓝山咖啡',
        description: '来自牙买加的顶级咖啡豆，酸味和香味均衡',
        price: 45,
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20mountain%20coffee%20premium%20quality%20in%20porcelain%20cup%20elegant%20presentation%20natural%20lighting&image_size=square',
        category: '精品单品',
        rating: 4.9,
        isNew: true
      },
      {
        id: '7',
        name: '冰滴咖啡',
        description: '低温长时间萃取，口感顺滑甘甜',
        price: 36,
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cold%20brew%20coffee%20in%20glass%20jug%20iced%20coffee%20refreshing%20summer%20drink&image_size=square',
        category: '冷萃系列',
        rating: 4.7,
        isHot: false
      },
      {
        id: '8',
        name: '皇家咖啡',
        description: '顶级蓝山咖啡加入特调酒液，火焰燃烧呈现',
        price: 58,
        image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=flambé%20coffee%20royal%20coffee%20with%20flames%20luxury%20presentation%20evening%20setting&image_size=square',
        category: '特色饮品',
        rating: 5.0,
        isNew: true
      }
    ] as Product[],
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
          this.removeFromCart(productId, size, temperature);
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
        total: this.cartTotalPrice,
        status: 'pending',
        createTime: new Date().toISOString(),
        deliveryType,
        address
      };
      
      this.orders.unshift(order);
      this.clearCart();
      
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
    key: 'coffee_app_store', // 设置存储的键名
    storage: localStorage, // 使用 localStorage 进行持久化存储
    paths: ['cart', 'favorites', 'orders', 'user'] // 指定需要持久化的状态字段
  }
});

// 保持向后兼容的计算属性和方法（如果需要）
export const cartActions = {
  addToCart: (product: any, quantity: number = 1, size?: string, temperature?: string) => {
    const store = useMainStore();
    store.addToCart(product, quantity, size, temperature);
  },
  removeFromCart: (productId: string, size?: string, temperature?: string) => {
    const store = useMainStore();
    store.removeFromCart(productId, size, temperature);
  },
  updateQuantity: (productId: string, quantity: number, size?: string, temperature?: string) => {
    const store = useMainStore();
    store.updateCartItemQuantity(productId, quantity, size, temperature);
  },
  clearCart: () => {
    const store = useMainStore();
    store.clearCart();
  },
  getCartItemCount: () => {
    const store = useMainStore();
    return store.cartItemCount;
  },
  getCartTotal: () => {
    const store = useMainStore();
    return store.cartTotalPrice;
  }
};

export const favoriteActions = {
  toggleFavorite: (productId: string) => {
    const store = useMainStore();
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
    const store = useMainStore();
    return store.createOrder(deliveryType, address);
  },
  updateOrderStatus: (orderId: string, status: any) => {
    const store = useMainStore();
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