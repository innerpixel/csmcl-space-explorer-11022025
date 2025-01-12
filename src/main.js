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
    window.dispatchEvent(new CustomEvent('pwa-update-available'))
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('pwa-offline-ready'))
  },
  onRegistered(registration) {
    // Check for updates periodically
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000) // Check every hour
  },
  immediate: true
})

// Make updateSW available globally for the Settings component
window.updateSW = updateSW

// Handle online/offline events
window.addEventListener('online', () => {
  app.config.globalProperties.$toast?.success('You are back online!')
})

window.addEventListener('offline', () => {
  app.config.globalProperties.$toast?.warning('You are offline. Some features may be limited.')
})

app.mount('#app')
