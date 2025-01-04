<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
    <div class="space-y-8">
      <!-- Welcome Section -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-white">
          Welcome back, {{ userStore.displayName }}
        </h1>
        <p class="mt-2 text-gray-400">Manage your space and explore the CSMCL network</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="action in quickActions"
          :key="action.title"
          class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6
                 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
        >
          <div class="text-3xl mb-4">{{ action.icon }}</div>
          <h3 class="text-lg font-medium text-white">{{ action.title }}</h3>
          <p class="text-gray-400 mt-2 text-sm">{{ action.description }}</p>
          <router-link
            :to="action.link"
            class="inline-block mt-4 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg
                   hover:bg-blue-500/20 transition-colors duration-300"
          >
            {{ action.buttonText }}
          </router-link>
        </div>
      </div>

      <!-- Space Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="stat in spaceStats"
          :key="stat.label"
          class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6
                 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
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
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const quickActions = computed(() => [
  {
    title: 'Configure Space',
    description: 'Customize your space settings and appearance',
    icon: '⚙️',
    link: '/onboarding/space',
    buttonText: 'Configure'
  },
  {
    title: 'Network',
    description: 'Connect with other spaces and manage your network',
    icon: '🔗',
    link: '/network',
    buttonText: 'View Network'
  },
  {
    title: 'Documentation',
    description: 'Learn about CSMCL features and capabilities',
    icon: '📚',
    link: '/documentation',
    buttonText: 'Read Docs'
  }
])

const spaceStats = computed(() => [
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
