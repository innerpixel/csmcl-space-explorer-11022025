<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>Settings</h1>
      <p class="subtitle">Manage your CSMCL Space preferences</p>
    </div>

    <div class="settings-grid">
      <!-- App Installation Section -->
      <div class="settings-section">
        <h2>App Installation</h2>
        <div class="settings-content">
          <div v-if="isPwaInstallable" class="setting-item">
            <div class="setting-info">
              <h3>Install CSMCL Space</h3>
              <p>Install the app on your device for better performance and offline access</p>
            </div>
            <button @click="installPwa" class="action-button">
              Install App
            </button>
          </div>
          
          <div v-if="updateAvailable" class="setting-item">
            <div class="setting-info">
              <h3>Update Available</h3>
              <p>A new version of CSMCL Space is available</p>
            </div>
            <button @click="updatePwa" class="action-button update">
              Update App
            </button>
          </div>

          <div v-if="isOfflineReady" class="setting-item">
            <div class="setting-info">
              <h3>Offline Ready</h3>
              <p>App is now available for offline use</p>
            </div>
            <span class="status-badge success">Ready</span>
          </div>

          <div v-if="!isPwaInstallable && !updateAvailable && !isOfflineReady" class="setting-item">
            <div class="setting-info">
              <h3>App Status</h3>
              <p>You're using the latest version of CSMCL Space</p>
            </div>
            <span class="status-badge">Up to date</span>
          </div>
        </div>
      </div>

      <!-- Admin Access Section -->
      <div class="settings-section">
        <h2>Admin Access</h2>
        <div class="settings-content">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Admin Privileges</h3>
              <p>{{ userStore.isAdmin ? 'You currently have admin access' : 'Request admin access to manage CSMCL Space' }}</p>
            </div>
            <button 
              v-if="!userStore.isAdmin" 
              @click="requestAdminAccess" 
              class="action-button admin"
            >
              Request Access
            </button>
            <button 
              v-else 
              @click="revokeAdminAccess" 
              class="action-button admin-revoke"
            >
              Revoke Access
            </button>
          </div>
        </div>
      </div>

      <!-- Theme Settings -->
      <div class="settings-section">
        <h2>Appearance</h2>
        <div class="settings-content">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Theme</h3>
              <p>Choose your preferred color theme</p>
            </div>
            <select 
              v-model="selectedTheme" 
              @change="updateTheme" 
              class="theme-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="settings-section">
        <h2>Notifications</h2>
        <div class="settings-content">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Push Notifications</h3>
              <p>Receive updates about your space</p>
            </div>
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="notificationsEnabled"
                @change="updateNotifications"
              >
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// PWA states
const isPwaInstallable = ref(false)
const updateAvailable = ref(false)
const isOfflineReady = ref(false)
const deferredPrompt = ref(null)

// Theme and notification states
const selectedTheme = ref(localStorage.getItem('theme') || 'system')
const notificationsEnabled = ref(userStore.preferences?.notifications ?? false)

// Event handlers for PWA
const handleBeforeInstallPrompt = (e) => {
  deferredPrompt.value = e
  isPwaInstallable.value = true
}

const handleAppInstalled = () => {
  isPwaInstallable.value = false
  deferredPrompt.value = null
}

const handleUpdateAvailable = () => {
  updateAvailable.value = true
}

const handleOfflineReady = () => {
  isOfflineReady.value = true
  setTimeout(() => {
    isOfflineReady.value = false
  }, 3000) // Hide offline ready message after 3 seconds
}

// Setup PWA event listeners
onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
  window.addEventListener('pwa-update-available', handleUpdateAvailable)
  window.addEventListener('pwa-offline-ready', handleOfflineReady)
})

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
  window.removeEventListener('pwa-update-available', handleUpdateAvailable)
  window.removeEventListener('pwa-offline-ready', handleOfflineReady)
})

// Install PWA
const installPwa = async () => {
  if (!deferredPrompt.value) {
    if (window.matchMedia('(display-mode: browser)').matches) {
      alert('Installation prompt not available. You may already have installed the app or your browser might not support PWA installation.')
    }
    return
  }
  
  try {
    const result = await deferredPrompt.value.prompt()
    const choice = await deferredPrompt.value.userChoice
    
    if (choice.outcome === 'accepted') {
      console.log('PWA installed successfully')
    } else {
      console.log('PWA installation declined')
    }
    
    deferredPrompt.value = null
    isPwaInstallable.value = false
  } catch (error) {
    console.error('PWA installation failed:', error)
    alert('Failed to install the app. Please try again.')
  }
}

// Update PWA
const updatePwa = async () => {
  if (!('serviceWorker' in navigator)) {
    alert('Service Worker not supported')
    return
  }

  try {
    if (typeof window.updateSW === 'function') {
      await window.updateSW()
      updateAvailable.value = false
      alert('App updated successfully! The page will reload to apply changes.')
      window.location.reload()
    } else {
      throw new Error('Update function not available')
    }
  } catch (error) {
    console.error('PWA update failed:', error)
    alert('Failed to update the app. Please try again.')
  }
}

// Admin access management
const requestAdminAccess = async () => {
  const code = prompt('Enter 2FA code for admin access:')
  if (code) {
    const result = await userStore.toggleAdmin(true, code)
    if (!result.success) {
      alert(result.error || 'Failed to enable admin access')
    }
  }
}

const revokeAdminAccess = async () => {
  if (confirm('Are you sure you want to revoke your admin access?')) {
    await userStore.toggleAdmin(false)
  }
}

// Theme management
const updateTheme = () => {
  localStorage.setItem('theme', selectedTheme.value)
  document.documentElement.setAttribute('data-theme', selectedTheme.value)
}

// Notification management
const updateNotifications = () => {
  userStore.updatePreferences({
    notifications: notificationsEnabled.value
  })
}
</script>

<style scoped>
.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  text-align: center;
  margin-bottom: 3rem;
}

.settings-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #4a5568;
  font-size: 1.1rem;
}

.settings-grid {
  display: grid;
  gap: 2rem;
}

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-section h2 {
  color: #2d3748;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.setting-info h3 {
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.setting-info p {
  color: #4a5568;
  font-size: 0.875rem;
}

.action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #4a90e2;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button:hover {
  background: #357abd;
}

.action-button.update {
  background: #48bb78;
}

.action-button.update:hover {
  background: #38a169;
}

.action-button.admin {
  background: #805ad5;
}

.action-button.admin:hover {
  background: #6b46c1;
}

.action-button.admin-revoke {
  background: #e53e3e;
}

.action-button.admin-revoke:hover {
  background: #c53030;
}

.theme-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #2d3748;
  cursor: pointer;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #48bb78;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: #4a5568;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.success {
  background: #48bb78;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 1rem;
  }

  .settings-header h1 {
    font-size: 2rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .action-button {
    width: 100%;
  }
}
</style>
