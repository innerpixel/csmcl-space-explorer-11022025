<template>
  <div class="space-y-8">
    <!-- Profile Header -->
    <ProfileHeader />

    <!-- Level and XP Banner -->
    <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 backdrop-blur-sm border border-blue-500/20">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">Explorer Mode</h2>
          <p class="text-gray-400">Try out CSMCL Space features</p>
        </div>
        <div class="text-right">
          <p class="text-xl font-semibold text-yellow-400">
            {{ getDaysLeft(userStore.preferences?.demoData?.lastVisited) }} days left
          </p>
          <p class="text-sm text-gray-400">
            in trial period
          </p>
        </div>
      </div>
    </div>

    <!-- Create Account Banner -->
    <div class="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 backdrop-blur-sm border border-green-500/20">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white">Ready to Join?</h2>
          <p class="text-gray-400 mt-1">Create your account to unlock all features</p>
        </div>
        <button
          @click="router.push('/login?mode=register')"
          class="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
        >
          Create Account
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">Explorer Metrics</h2>
        <div class="text-sm text-gray-400">Last 24h</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="stat in userStats"
          :key="stat.label"
          class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 
                 p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl">{{ stat.icon }}</div>
            <div class="text-xs text-gray-500">Last 24h</div>
          </div>
          <h3 class="text-lg font-medium text-white">{{ stat.label }}</h3>
          <div class="mt-2 space-y-1">
            <template v-if="typeof stat.value === 'object'">
              <div v-for="(value, key) in stat.value" :key="key" 
                   class="flex justify-between items-center">
                <span class="text-sm text-gray-400 capitalize">{{ key }}</span>
                <span class="text-sm font-medium text-white">{{ value }}</span>
              </div>
            </template>
            <template v-else>
              <p class="text-gray-400">{{ stat.value }}</p>
            </template>
          </div>
          <p class="text-xs text-gray-500 mt-3">{{ stat.description }}</p>
        </div>
      </div>
    </div>

    <!-- Explorer Features Progress -->
    <div class="mt-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">Explorer Mode Features</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import ProfileHeader from './ProfileHeader.vue'

const router = useRouter()
const userStore = useUserStore()

const userStats = computed(() => [
  {
    label: 'Exploration',
    icon: '🚀',
    value: {
      'Spaces Visited': userStore.preferences?.metrics?.find(m => m.name === 'Spaces Visited')?.value || 0,
      'Features Tried': userStore.preferences?.metrics?.find(m => m.name === 'Features Discovered')?.value || 0,
      'Time Spent': formatTimeSpent(userStore.preferences?.demoData?.lastVisited)
    },
    description: 'Your exploration progress'
  },
  {
    label: 'Bot Interactions',
    icon: '🤖',
    value: {
      'Bots Met': userStore.preferences?.metrics?.find(m => m.name === 'Bots Interacted')?.value || 0,
      'Chats Started': userStore.preferences?.demoData?.interactions || 0,
      'Favorites': userStore.preferences?.demoData?.favorites?.length || 0
    },
    description: 'Your interactions with demo bots'
  },
  {
    label: 'Trial Status',
    icon: '⏳',
    value: {
      'Days Left': getDaysLeft(userStore.preferences?.demoData?.lastVisited),
      'Mode': 'Explorer',
      'Status': userStore.isExplorerExpired ? 'Expired' : 'Active'
    },
    description: 'Your explorer trial status'
  }
])

// Format time spent in explorer mode
function formatTimeSpent(startDate) {
  if (!startDate) return '0 minutes'
  const start = new Date(startDate)
  const diff = Date.now() - start.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} minutes`
}

// Calculate days left in trial
function getDaysLeft(startDate) {
  if (!startDate) return 10
  const start = new Date(startDate)
  const expiry = new Date(start)
  expiry.setDate(expiry.getDate() + 10)
  const daysLeft = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24))
  return Math.max(0, daysLeft)
}
</script>
