<template>
  <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
    <div class="flex items-center space-x-6">
      <!-- Avatar -->
      <div class="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600
                  flex items-center justify-center text-2xl font-bold text-white">
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
        <p class="text-gray-400 mt-1">{{ userStore.cosmicalEmail }}</p>
        
        <!-- Explorer Expiry -->
        <div v-if="userStore.isExplorer" class="mt-2">
          <p class="text-sm text-gray-500">
            Explorer access expires: {{ formatDate(userStore.explorerExpiry) }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-x-3">
        <button
          v-if="canEdit"
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
  const name = userStore.user?.displayName || userStore.displayName
  return name ? name[0]?.toUpperCase() : '?'
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
</script>
