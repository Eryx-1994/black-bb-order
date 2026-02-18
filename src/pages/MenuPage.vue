<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <!-- <button @click="$router.go(-1)" class="p-2">
          <ArrowLeft :size="20" class="text-gray-600" />
        </button> -->
        <h1 class="text-lg font-bold text-gray-800">小黑奴BB的菜单</h1>
        <button @click="$router.push('/cart')" class="relative p-2">
          <ShoppingCart :size="20" class="text-gray-600" />
          <div
            v-if="cartItemCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cartItemCount > 99 ? '99+' : cartItemCount }}
          </div>
        </button>
      </div>
      
      <!-- 搜索栏 -->
      <div class="px-4 pb-3">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索商品..."
            class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white"
          />
        </div>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="bg-white border-b border-gray-200 sticky top-16 z-30">
      <div class="flex overflow-x-auto px-4 py-3 space-x-2 scrollbar-hide">
        <button
          @click="selectedCategory = ''"
          class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === '' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          全部
        </button>
        <button
          v-for="category in store.categories"
          :key="category.id"
          @click="selectedCategory = category.name"
          class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
          :class="selectedCategory === category.name ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="px-4 py-4">
      <div v-if="filteredProducts.length === 0 && !mainStore.loadingProducts" class="text-center py-12">
        <Coffee :size="48" class="text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">暂无相关商品</p>
      </div>
      
      <div v-else-if="mainStore.loadingProducts" class="text-center py-12">
        <p class="text-gray-500">正在加载商品...</p>
      </div>
      
      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          @click="goToProduct(product.id)"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        >
          <div class="relative">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-36 object-cover"
            />
            <div v-if="product.isHot" class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              热销
            </div>
            <div v-if="product.isNew" class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              新品
            </div>
            <button
              @click.stop="toggleFavorite(product.id)"
              class="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"
            >
              <Heart
                :size="16"
                :class="favoriteActions.isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'"
              />
            </button>
          </div>
          
          <div class="p-3">
            <h3 class="font-medium text-gray-800 mb-1">{{ product.name }}</h3>
            <p class="text-xs text-gray-500 mb-2 line-clamp-2">{{ product.description }}</p>
            
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-1">
                <Star :size="12" class="text-yellow-400 fill-current" />
                <span class="text-xs text-gray-600">{{ product.rating }}</span>
              </div>
              <span class="text-xs text-gray-500">{{ product.category }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-amber-600">¥{{ product.price }}</span>
              <button
                @click.stop="quickAddToCart(product)"
                class="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors flex items-center space-x-1"
              >
                <Plus :size="14" />
                <span>加购</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, ShoppingCart, Search, Coffee, Heart, Star, Plus
} from 'lucide-vue-next'
import { store, cartActions, favoriteActions, useMainStore } from '@/stores'
import { toast } from 'vue-sonner'

const route = useRoute()
const searchQuery = ref('')
const selectedCategory = ref('')

// 获取主 store 实例
const mainStore = useMainStore()

// 购物车商品数量
const cartItemCount = computed(() => cartActions.getCartItemCount())

// 过滤商品
const filteredProducts = computed(() => {
  let products = store.products
  
  // 按分类筛选
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }
  
  return products
})

// 页面初始化 - 仅在首次加载时
onMounted(async () => {
  // 如果路由守卫没有自动加载数据，这里可以作为一个后备
  if (mainStore.products.length === 0) {
    await mainStore.loadProducts()
  }
  
  // 如果从首页传入了分类参数，设置默认选中的分类
  if (route.query.category) {
    selectedCategory.value = route.query.category as string
  }
})

// 导航到商品详情
const goToProduct = (productId: string) => {
  // 这里可以添加产品ID到路由，或者打开详细信息弹窗
  console.log("Go to product:", productId)
}

// 快速添加到购物车
const quickAddToCart = (product: any) => {
  cartActions.addToCart(product, 1)
  toast.success(`${product.name} 已添加到购物车`)
}

// 切换收藏
const toggleFavorite = (productId: string) => {
  favoriteActions.toggleFavorite(productId)
  const isFav = favoriteActions.isFavorite(productId)
  toast.success(isFav ? '已添加到收藏' : '已取消收藏')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>