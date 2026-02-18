import { createRouter, createWebHistory } from 'vue-router'
import MenuPage from '@/pages/MenuPage.vue'
import CartPage from '@/pages/CartPage.vue'
import OrderPage from '@/pages/OrderPage.vue'
import uploadFile from '@/pages/upload-file.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   
    {
      path: '/',
      name: 'menu',
      component: MenuPage,
      meta: { 
        reloadOnSwitch: true // 每次切换到此路由都重新加载数据
      }
    },
   
    {
      path: '/cart',
      name: 'cart',
      component: CartPage
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderPage
    },
    {
      path: '/admin',
      name: 'admin',
      component: uploadFile
    },
  ]
})

// 全局导航守卫，用于处理需要每次加载数据的页面
router.beforeEach(async (to, from) => {
  const mainStore = (await import('@/stores')).useMainStore();
  const store = mainStore;
  
  // 如果目标路由需要重新加载数据
  if (to.meta.reloadOnSwitch && to.name === 'menu') {
    try {
      await store.loadProducts();
    } catch (error) {
      console.error('加载产品数据失败:', error);
    }
  }
})

export default router