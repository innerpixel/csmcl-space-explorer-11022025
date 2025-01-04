<template>
  <div class="space-y-8">
    <!-- Profile Header -->
    <ProfileHeader />

    <!-- Space Configuration -->
    <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
      <h2 class="text-xl font-semibold text-white mb-4">Space Configuration</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-400">Theme</h3>
          <p class="mt-1 text-white">{{ userStore.space?.theme || 'Not configured' }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-400">Visibility</h3>
          <p class="mt-1 text-white">{{ userStore.space?.visibility || 'Private' }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-400">Network Status</h3>
          <p class="mt-1 text-white">{{ userStore.networkStatus || 'Not connected' }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-400">Wallet</h3>
          <p class="mt-1 text-white">{{ userStore.wallet?.connected ? 'Connected' : 'Not connected' }}</p>
        </div>
      </div>
      <div class="mt-6">
        <router-link
          to="/onboarding/space"
          class="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg
                 hover:bg-blue-500/20 transition-colors duration-300"
        >
          Configure Space
        </router-link>
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../stores/user'
import ProfileHeader from './ProfileHeader.vue'

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
  }
])
</script>
