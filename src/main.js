import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)

// Register service worker using vite-plugin-pwa
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Would you like to update?')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
  immediate: true
})

// Handle offline/online events
window.addEventListener('online', () => {
  app.config.globalProperties.$toast?.success('Connection restored!')
})

window.addEventListener('offline', () => {
  app.config.globalProperties.$toast?.warning('You are offline. Some features may be limited.')
})

app.mount('#app')
