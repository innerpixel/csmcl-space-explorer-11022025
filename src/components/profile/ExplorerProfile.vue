<template>
  <div class="space-y-8">
    <!-- Profile Header -->
    <ProfileHeader />

    <!-- Stats Grid -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">Space Analytics</h2>
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

    <!-- Onboarding Progress -->
    <div class="mt-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">Explorer Mode Features</h2>
      </div>
      <OnboardingProgress 
        class="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6" 
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../stores/user'
import ProfileHeader from './ProfileHeader.vue'
import OnboardingProgress from './OnboardingProgress.vue'

const userStore = useUserStore()

const userStats = computed(() => [
  {
    label: 'Space Activity',
    value: userStore.spaceActivity,
    icon: '🌟',
    description: 'Interactions and chatter traffic in your space'
  },
  {
    label: 'Network',
    value: userStore.networkStats,
    icon: '🔗',
    description: 'Active connections and pending requests'
  },
  {
    label: 'Transactions',
    value: userStore.transactionStats,
    icon: '⚡',
    description: 'Total sent and received transactions'
  },
  {
    label: 'Social Reach',
    value: userStore.socialStats,
    icon: '🌍',
    description: 'Content shares and engagement rate'
  },
  {
    label: 'Requests',
    value: userStore.requestStats,
    icon: '📬',
    description: 'Pending space access requests'
  },
  {
    label: 'Traffic',
    value: userStore.trafficStats,
    icon: '📊',
    description: 'Real-time space traffic metrics'
  }
])

const explorerTimeLeft = computed(() => {
  if (!userStore.explorerExpiry) return null
  
  const expiryDate = new Date(userStore.explorerExpiry)
  if (isNaN(expiryDate.getTime())) return null
  
  const timeLeft = Math.max(0, expiryDate.getTime() - Date.now())
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m`
  }
  return 'Expired'
})
</script>
