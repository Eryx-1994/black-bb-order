import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// 创建Vue应用实例
const app = createApp(App)
app.use(pinia)   
// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')
