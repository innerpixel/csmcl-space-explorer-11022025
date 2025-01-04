<template>
  <div class="space-y-8">
    <!-- Profile Header -->
    <ProfileHeader />

    <!-- Admin Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="stat in adminStats"
        :key="stat.label"
        class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 
               p-6 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-500"
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

    <!-- Recent Actions -->
    <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
      <h2 class="text-xl font-semibold text-white mb-4">Recent Actions</h2>
      <div class="space-y-4">
        <div
          v-for="(action, index) in recentActions"
          :key="index"
          class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-700/20 transition-colors"
        >
          <div class="text-2xl">{{ action.icon }}</div>
          <div class="flex-1">
            <p class="text-white">{{ action.description }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ action.time }}</p>
          </div>
          <div class="text-xs px-2 py-1 rounded-full" :class="[
            action.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
            action.type === 'error' ? 'bg-red-500/20 text-red-400' :
            'bg-green-500/20 text-green-400'
          ]">
            {{ action.status }}
          </div>
        </div>
      </div>
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
        <button
          @click="handleQuickAction(action)"
          class="inline-block mt-4 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg
                 hover:bg-purple-500/20 transition-colors duration-300"
        >
          {{ action.buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { usePermissions } from '../../composables/usePermissions'
import ProfileHeader from '../shared/ProfileHeader.vue'

const router = useRouter()
const userStore = useUserStore()
const { canEdit, canManageUsers } = usePermissions()

// Admin Stats
const adminStats = computed(() => [
  {
    label: 'User Activity',
    icon: '👥',
    value: {
      'Active Users': '124',
      'New Signups': '12',
      'Pending Verifications': '5'
    },
    description: 'User activity metrics across the platform'
  },
  {
    label: 'System Health',
    icon: '🚀',
    value: {
      'CPU Usage': '45%',
      'Memory': '3.2GB',
      'Response Time': '120ms'
    },
    description: 'Current system performance metrics'
  },
  {
    label: 'Space Metrics',
    icon: '🌌',
    value: {
      'Total Spaces': '256',
      'Active': '180',
      'Storage Used': '1.2TB'
    },
    description: 'Space utilization and activity metrics'
  }
])

// Recent Actions
const recentActions = ref([
  {
    icon: '🔧',
    description: 'System maintenance completed',
    time: '2 hours ago',
    type: 'success'
  },
  {
    icon: '⚠️',
    description: 'High memory usage detected',
    time: '4 hours ago',
    type: 'warning'
  },
  {
    icon: '🔒',
    description: 'Security audit completed',
    time: '6 hours ago',
    type: 'info'
  }
])

// Quick Actions
const quickActions = computed(() => [
  {
    title: 'System Metrics',
    description: 'Monitor system performance and health',
    icon: '📊',
    action: () => router.push('/admin/metrics'),
    visible: canEdit.value,
    buttonText: 'View Metrics'
  },
  {
    title: 'User Management',
    description: 'Manage user accounts and permissions',
    icon: '👥',
    action: () => router.push('/admin/users'),
    visible: canManageUsers.value,
    buttonText: 'Manage Users'
  },
  {
    title: 'Space Configuration',
    description: 'Configure global space settings',
    icon: '⚙️',
    action: () => router.push('/admin/config'),
    visible: canEdit.value,
    buttonText: 'Configure Space'
  }
].filter(action => action.visible))

const handleQuickAction = (action) => {
  if (action.action) {
    action.action()
  }
}
</script>
