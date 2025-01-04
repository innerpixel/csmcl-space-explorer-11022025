<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
    <div class="space-y-8">
      <!-- Welcome Section -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-purple-400">
          InnerPixel Admin Dashboard
        </h1>
        <p class="mt-2 text-gray-400">Monitor and manage the CSMCL network</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="action in quickActions"
          :key="action.title"
          class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6
                 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-500"
        >
          <div class="text-3xl mb-4">{{ action.icon }}</div>
          <h3 class="text-lg font-medium text-white">{{ action.title }}</h3>
          <p class="text-gray-400 mt-2 text-sm">{{ action.description }}</p>
          <router-link
            :to="action.link"
            class="inline-block mt-4 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg
                   hover:bg-purple-500/20 transition-colors duration-300"
          >
            {{ action.buttonText }}
          </router-link>
        </div>
      </div>

      <!-- System Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="stat in systemStats"
          :key="stat.label"
          class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6
                 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-500"
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

      <!-- Recent Activity -->
      <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div class="space-y-4">
          <div
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-700/20 transition-colors"
          >
            <div class="text-2xl">{{ activity.icon }}</div>
            <div class="flex-1">
              <p class="text-white">{{ activity.description }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
            <div class="text-xs px-2 py-1 rounded-full" :class="[
              activity.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              activity.type === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-green-500/20 text-green-400'
            ]">
              {{ activity.status }}
            </div>
          </div>
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
    title: 'System Metrics',
    description: 'Monitor system performance and health',
    icon: '📊',
    link: '/admin/metrics',
    buttonText: 'View Metrics'
  },
  {
    title: 'User Management',
    description: 'Manage users and permissions',
    icon: '👥',
    link: '/admin/users',
    buttonText: 'Manage Users'
  },
  {
    title: 'Network Control',
    description: 'Configure network settings and security',
    icon: '🔐',
    link: '/admin/network',
    buttonText: 'Network Settings'
  }
])

const systemStats = computed(() => [
  {
    label: 'System Health',
    value: {
      uptime: '99.99%',
      latency: '45ms',
      errors: '0'
    },
    icon: '🏥',
    description: 'Overall system performance metrics'
  },
  {
    label: 'Active Users',
    value: {
      total: '1,234',
      online: '456',
      new: '+23'
    },
    icon: '👥',
    description: 'Current user activity statistics'
  },
  {
    label: 'Network Load',
    value: {
      bandwidth: '78%',
      requests: '23k/s',
      queue: '12'
    },
    icon: '🌐',
    description: 'Network performance and load metrics'
  }
])

const recentActivity = computed(() => [
  {
    icon: '🚀',
    description: 'System update deployed successfully',
    time: '2 minutes ago',
    status: 'Success',
    type: 'success'
  },
  {
    icon: '⚠️',
    description: 'High network latency detected in EU region',
    time: '15 minutes ago',
    status: 'Warning',
    type: 'warning'
  },
  {
    icon: '🔒',
    description: 'Security audit completed',
    time: '1 hour ago',
    status: 'Completed',
    type: 'success'
  }
])
</script>
