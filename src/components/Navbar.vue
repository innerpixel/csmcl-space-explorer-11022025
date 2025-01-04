<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isUserMenuOpen = ref(false)

const userInitials = computed(() => {
  if (!userStore.displayName) return '?'
  return userStore.displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const userStats = computed(() => [
  {
    label: 'Space Size',
    value: userStore.spaceSize || '0 GB'
  },
  {
    label: 'CSMCL.ID',
    value: userStore.cosmicalEmail || 'Not Set'
  },
  {
    label: 'Wallet',
    value: userStore.walletStatus || 'Not Connected'
  }
])

const navLinks = [
  {
    name: 'Documentation',
    path: '/documentation'
  }
]

const getStartedLink = {
  name: 'Get Started',
  path: '/onboarding/identity'
}

const isOnboardingRoute = computed(() => {
  return route.path.startsWith('/onboarding')
})

const handleNavigation = (path) => {
  router.push(path)
  isUserMenuOpen.value = false
}

const logout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-gray-900/30 backdrop-blur-md border-b border-gray-700/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Left side - Brand and Navigation -->
        <div class="flex items-center space-x-8">
          <!-- Brand -->
          <button 
            @click="handleNavigation('/')"
            class="text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300"
          >
            CSMCL
          </button>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-4">
            <button
              v-for="link in navLinks"
              :key="link.path"
              @click="handleNavigation(link.path)"
              class="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 transition-all duration-300
                     hover:bg-gray-800/50 hover:text-white"
              :class="{ 'text-blue-400 bg-blue-500/10': route.path === link.path }"
            >
              {{ link.name }}
            </button>

            <!-- Get Started Button -->
            <button
              v-if="!userStore.isLoggedIn"
              @click="handleNavigation(getStartedLink.path)"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                     hover:bg-blue-500/20"
              :class="{ 
                'bg-blue-500/10 text-blue-400': isOnboardingRoute,
                'text-gray-300': !isOnboardingRoute
              }"
            >
              {{ getStartedLink.name }}
            </button>
          </div>
        </div>

        <!-- Right side - User Menu -->
        <div class="flex items-center">
          <!-- User is logged in -->
          <template v-if="userStore.isLoggedIn">
            <div class="relative">
              <button
                @click="isUserMenuOpen = !isUserMenuOpen"
                class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                       text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              >
                <div 
                  class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600
                         flex items-center justify-center text-white font-medium"
                >
                  {{ userInitials }}
                </div>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-48 rounded-xl bg-gray-800/90 backdrop-blur-lg
                       border border-gray-700/50 shadow-xl overflow-hidden"
              >
                <div class="p-3 border-b border-gray-700/50">
                  <div 
                    v-for="stat in userStats"
                    :key="stat.label"
                    class="flex justify-between items-center py-1"
                  >
                    <span class="text-xs text-gray-500">{{ stat.label }}</span>
                    <span class="text-xs text-gray-300">{{ stat.value }}</span>
                  </div>
                </div>
                <div class="p-1">
                  <button
                    @click="handleNavigation('/profile')"
                    class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50
                           hover:text-white transition-colors rounded-lg"
                  >
                    Profile
                  </button>
                  <button
                    @click="logout"
                    class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10
                           hover:text-red-300 transition-colors rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- User is not logged in -->
          <template v-else>
            <button
              @click="handleNavigation('/login')"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-300
                     hover:text-white hover:bg-gray-800/50 transition-all duration-300"
            >
              Sign In
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Add any additional styles here */
</style>
