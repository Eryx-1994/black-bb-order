<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div class="flex justify-around items-center py-2">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center py-1 px-3 relative"
        :class="{
          'text-amber-600': $route.name === item.name,
          'text-gray-500': $route.name !== item.name
        }"
      >
        <component :is="item.icon" :size="24" />
        <span class="text-xs mt-1">{{ item.label }}</span>
        
        <!-- 购物车数量徽章 -->
        <div
          v-if="item.name === 'cart' && cartItemCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ cartItemCount > 99 ? '99+' : cartItemCount }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Home, Coffee, ShoppingCart, FileText, User } from 'lucide-vue-next'
import { store, cartActions } from '@/stores'

const navItems = [
  // {
  //   name: 'home',
  //   path: '/',
  //   label: '首页',
  //   icon: Home
  // },
  {
    name: 'menu',
    path: '/',
    label: 'BB的菜单',
    icon: Coffee
  },
  {
    name: 'cart',
    path: '/cart',
    label: 'BB的购物车',
    icon: ShoppingCart
  },
  {
    name: 'orders',
    path: '/orders',
    label: 'BB的订单',
    icon: FileText
  },
  
]

const cartItemCount = computed(() => cartActions.getCartItemCount())
</script>