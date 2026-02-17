import { createRouter, createWebHistory } from 'vue-router'
import MenuPage from '@/pages/MenuPage.vue'
import CartPage from '@/pages/CartPage.vue'
import OrderPage from '@/pages/OrderPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   
    {
      path: '/',
      name: 'menu',
      component: MenuPage
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
   
  ]
})

export default router
