<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="$router.go(-1)" class="p-2">
          <ArrowLeft :size="20" class="text-gray-600" />
        </button>
        <h1 class="text-lg font-bold text-gray-800">购物车</h1>
        <button
          v-if="store.cart.length > 0"
          @click="clearCart"
          class="text-sm text-red-500 font-medium"
        >
          清空
        </button>
        <div v-else class="w-12"></div>
      </div>
    </div>

    <!-- 购物车内容 -->
    <div class="flex-1 pb-32">
      <!-- 空购物车 -->
      <div v-if="store.cart.length === 0" class="flex flex-col items-center justify-center py-20">
        <ShoppingCart :size="64" class="text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-500 mb-2">购物车是空的</h3>
        <p class="text-sm text-gray-400 mb-6">快去选购你喜欢的咖啡吧</p>
        <button
          @click="$router.push('/')"
          class="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors"
        >
          去选购
        </button>
      </div>

      <!-- 购物车商品列表 -->
      <div v-else class="px-4 py-4 space-y-4">
        <div
          v-for="item in store.cart"
          :key="`${item.id}-${item.size}-${item.temperature}`"
          class="bg-white rounded-xl p-4 shadow-sm"
        >
          <div class="flex items-start space-x-3">
            <!-- 商品图片 -->
            <img
              :src="item.image"
              :alt="item.name"
              class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            
            <!-- 商品信息 -->
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-800 mb-1">{{ item.name }}</h3>
              <div class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span>{{ item.size }}</span>
                <span>•</span>
                <span>{{ item.temperature }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold text-amber-600">¥{{ item.price }}</div>
                
                <!-- 数量控制 -->
                <div class="flex items-center space-x-3">
                  <button
                    @click="decreaseQuantity(item)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-amber-600 transition-colors"
                  >
                    <Minus :size="14" />
                  </button>
                  <span class="text-lg font-medium min-w-[2rem] text-center">{{ item.quantity }}</span>
                  <button
                    @click="increaseQuantity(item)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-amber-600 transition-colors"
                  >
                    <Plus :size="14" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 删除按钮 -->
            <button
              @click="removeItem(item)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div v-if="store.cart.length > 0" class="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200">
      <!-- 配送方式选择 -->
      
      <!-- 价格明细 -->
      <div class="px-4 py-3 border-b border-gray-100">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">商品总价</span>
          <span class="text-sm text-gray-800">¥{{ subtotal }}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-base font-medium text-gray-800">总计</span>
          <span class="text-lg font-bold text-amber-600">¥{{ totalAmount }}</span>
        </div>
      </div>
      
      <!-- 结算按钮 -->
      <div class="px-4 py-4">
        <button
          @click="checkout"
          class="w-full bg-amber-600 text-white py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
        >
          <CreditCard :size="20" />
          <span>立即结算 ({{ cartItemCount }}件商品)</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, ShoppingCart, Minus, Plus, Trash2, Store, Truck, CreditCard
} from 'lucide-vue-next'
import { store, cartActions, orderActions, type CartItem } from '@/stores'
import { toast } from 'vue-sonner'

const router = useRouter()
const deliveryType = ref<'pickup' | 'delivery'>('pickup')

// 计算属性
const cartItemCount = computed(() => cartActions.getCartItemCount())
const subtotal = computed(() => cartActions.getCartTotal())
const deliveryFee = computed(() => deliveryType.value === 'delivery' ? 5 : 0)
const totalAmount = computed(() => subtotal.value + deliveryFee.value)

// 数量操作
const increaseQuantity = (item: CartItem) => {
  cartActions.updateQuantity(item.id, item.quantity + 1, item.size, item.temperature)
}

const decreaseQuantity = (item: CartItem) => {
  if (item.quantity > 1) {
    cartActions.updateQuantity(item.id, item.quantity - 1, item.size, item.temperature)
  } else {
    removeItem(item)
  }
}

// 删除商品
const removeItem = (item: CartItem) => {
  cartActions.removeFromCart(item.id, item.size, item.temperature)
  toast.success('商品已移除')
}

// 清空购物车
const clearCart = () => {
  if (confirm('确定要清空购物车吗？')) {
    cartActions.clearCart()
    toast.success('购物车已清空')
  }
}

// 结算
const checkout = () => {
  if (store.cart.length === 0) {
    toast.error('购物车是空的')
    return
  }
  
  try {
    // 创建订单
    const order = orderActions.createOrder(deliveryType.value)
    
    toast.success('订单创建成功！')
    
    // 跳转到订单页面
    router.push('/orders')
    
    // 模拟订单状态更新
    setTimeout(() => {
      orderActions.updateOrderStatus(order.id, 'preparing')
    }, 100)
    
    setTimeout(() => {
      orderActions.updateOrderStatus(order.id, 'ready')
    }, 100)
    
  } catch (error) {
    toast.error('订单创建失败，请重试')
    console.error('Checkout error:', error)
  }
}
</script>