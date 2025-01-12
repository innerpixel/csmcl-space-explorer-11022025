<template>
  <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
    <div class="flex items-center space-x-6">
      <!-- Avatar -->
      <div :class="`h-20 w-20 rounded-full bg-gradient-to-br ${avatarBackground}
                  flex items-center justify-center text-2xl font-bold text-white
                  shadow-lg shadow-blue-500/20`">
        {{ userInitials }}
      </div>

      <!-- User Info -->
      <div class="flex-1">
        <div class="flex items-center space-x-3">
          <h1 class="text-2xl font-bold text-white">{{ displayName }}</h1>
          <span 
            v-if="userStore.isAdmin"
            class="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400"
          >
            Admin
          </span>
          <span 
            v-else-if="userStore.isExplorer"
            class="px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400"
          >
            Explorer
          </span>
        </div>
        <p class="text-gray-400 mt-1">{{ userStore.user?.email || 'explorer@csmcl.space' }}</p>
        
        <!-- Explorer Info -->
        <div v-if="userStore.isExplorer" class="mt-2 space-y-2">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-400">Trial Status:</span>
            <span 
              :class="userStore.isExplorerExpired ? 'text-red-400' : 'text-green-400'"
              class="text-sm font-medium"
            >
              {{ userStore.isExplorerExpired ? 'Expired' : 'Active' }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-400">Time Left:</span>
            <span class="text-sm text-yellow-400 font-medium">
              {{ getDaysLeft(userStore.explorerExpiry) }} days
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-x-3">
        <button
          v-if="userStore.isExplorer"
          @click="router.push('/login?mode=register')"
          class="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30
                 hover:bg-green-500/20 transition-all duration-300"
        >
          Create Account
        </button>
        <button
          v-if="canEdit && !userStore.isExplorer"
          @click="router.push('/profile/edit')"
          class="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30
                 hover:bg-blue-500/20 transition-all duration-300"
        >
          Edit Profile
        </button>
        <button
          v-if="canManageUsers"
          @click="router.push('/admin/users')"
          class="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30
                 hover:bg-purple-500/20 transition-all duration-300"
        >
          Manage Users
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { usePermissions } from '../../composables/usePermissions'

const router = useRouter()
const userStore = useUserStore()
const { canEdit, canManageUsers } = usePermissions()

const userInitials = computed(() => {
  if (userStore.isExplorer) {
    return '🚀'  // Explorer gets a rocket
  }
  if (userStore.isAdmin) {
    return '👑'  // Admin gets a crown
  }
  const name = userStore.user?.displayName || userStore.displayName
  if (!name) {
    return '😊'  // Default to smiley face instead of question mark
  }
  return name[0]?.toUpperCase()
})

const avatarBackground = computed(() => {
  if (userStore.isExplorer) {
    return 'from-blue-500 to-purple-600'  // Cool gradient for explorer
  }
  if (userStore.isAdmin) {
    return 'from-purple-500 to-pink-600'  // Special gradient for admin
  }
  return 'from-blue-500 to-blue-600'  // Default gradient
})

const displayName = computed(() => {
  return userStore.user?.displayName || userStore.displayName || 'User'
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getDaysLeft = (startDate) => {
  if (!startDate) return 10
  const start = new Date(startDate)
  const expiry = new Date(start)
  expiry.setDate(expiry.getDate() + 10)
  const daysLeft = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24))
  return Math.max(0, daysLeft)
}
</script>
