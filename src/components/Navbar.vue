<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-900/30 backdrop-blur-lg border-b border-gray-700/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            CSMCL.SPACE
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center">
          <template v-if="userStore.isLoggedIn">
            <div class="relative">
              <button
                @click="toggleMenu"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 
                       hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              >
                <div 
                  class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600
                         flex items-center justify-center text-white text-sm font-medium"
                >
                  {{ userInitials }}
                </div>
                <span class="text-sm hidden sm:block">{{ userStore.displayName }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-show="isUserMenuOpen"
                class="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden bg-gray-800/90 
                       backdrop-blur-lg border border-gray-700/50 shadow-xl"
              >
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-gray-700/50">
                  <p class="text-sm font-medium text-white">{{ userStore.displayName }}</p>
                  <p class="text-xs text-gray-400">{{ userStore.cosmicalEmail }}</p>
                </div>

                <!-- Menu Items -->
                <div class="py-1">
                  <!-- Admin Dashboard -->
                  <router-link
                    v-if="userStore.isAdmin"
                    to="/admin"
                    custom
                    v-slot="{ navigate }"
                  >
                    <button
                      @click="navigateAndClose(navigate)"
                      class="w-full text-left px-4 py-2 text-sm text-purple-400 hover:bg-purple-500/10
                             hover:text-purple-300 transition-colors"
                    >
                      Admin Dashboard
                    </button>
                  </router-link>

                  <!-- Explorer Dashboard -->
                  <router-link
                    v-else-if="userStore.isExplorer"
                    to="/explorer"
                    custom
                    v-slot="{ navigate }"
                  >
                    <button
                      @click="navigateAndClose(navigate)"
                      class="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/10
                             hover:text-blue-300 transition-colors"
                    >
                      Explorer Dashboard
                    </button>
                  </router-link>

                  <!-- User Dashboard -->
                  <router-link
                    v-else
                    to="/dashboard"
                    custom
                    v-slot="{ navigate }"
                  >
                    <button
                      @click="navigateAndClose(navigate)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50
                             hover:text-white transition-colors"
                    >
                      Dashboard
                    </button>
                  </router-link>

                  <!-- Profile -->
                  <router-link
                    to="/profile"
                    custom
                    v-slot="{ navigate }"
                  >
                    <button
                      @click="navigateAndClose(navigate)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50
                             hover:text-white transition-colors"
                    >
                      Profile
                    </button>
                  </router-link>

                  <!-- Sign Out -->
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10
                           hover:text-red-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Login Button -->
          <template v-else>
            <router-link
              to="/login"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 
                     hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              Sign In
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const isUserMenuOpen = ref(false)

// Computed
const userInitials = computed(() => {
  return userStore.displayName?.[0]?.toUpperCase() || '?'
})

// Methods
const toggleMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const navigateAndClose = (navigate) => {
  navigate()
  isUserMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    isUserMenuOpen.value = false
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Close menu when clicking outside
const closeMenuOnClickOutside = (event) => {
  if (isUserMenuOpen.value && !event.target.closest('.relative')) {
    isUserMenuOpen.value = false
  }
}

// Add/remove click outside listener
onMounted(() => {
  document.addEventListener('click', closeMenuOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnClickOutside)
})
</script>
