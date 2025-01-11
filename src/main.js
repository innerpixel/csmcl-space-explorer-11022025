import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              if (confirm('New version available! Would you like to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });

  // Handle offline/online events
  window.addEventListener('online', () => {
    app.config.globalProperties.$toast?.success('Connection restored!');
  });

  window.addEventListener('offline', () => {
    app.config.globalProperties.$toast?.warning('You are offline. Some features may be limited.');
  });
}

app.mount('#app')
