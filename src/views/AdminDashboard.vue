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
      <stats-grid>
        <dashboard-card
          v-for="action in quickActions"
          :key="action.title"
          :title="action.title"
          :icon="action.icon"
          :description="action.description"
          variant="admin"
        >
          <template #footer>
            <router-link
              :to="action.link"
              class="inline-block mt-4 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg
                     hover:bg-purple-500/20 transition-colors duration-300"
            >
              {{ action.buttonText }}
            </router-link>
          </template>
        </dashboard-card>
      </stats-grid>

      <!-- System Stats -->
      <stats-grid>
        <stat-card
          v-for="stat in systemStats"
          :key="stat.label"
          :label="stat.label"
          :value="stats.stats[stat.key]"
          :icon="stat.icon"
          :description="stat.description"
          :loading="stats.loading"
          :error="stats.error"
          variant="admin"
        />
      </stats-grid>

      <!-- Recent Activity -->
      <dashboard-card variant="admin">
        <template #title>
          <h2 class="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        </template>
        
        <div v-if="activity.loading" class="flex justify-center py-8">
          <loading-spinner />
        </div>
        
        <div v-else-if="activity.error" class="text-red-400 p-4">
          {{ activity.error }}
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="(item, index) in activity.activities"
            :key="index"
            class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-700/20 transition-colors"
          >
            <div class="text-2xl">{{ item.icon }}</div>
            <div class="flex-1">
              <p class="text-white">{{ item.description }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ item.time }}</p>
            </div>
            <div class="text-xs px-2 py-1 rounded-full" :class="[
              item.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              item.type === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-green-500/20 text-green-400'
            ]">
              {{ item.status }}
            </div>
          </div>
        </div>
      </dashboard-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useStats } from '../composables/useStats'
import { useActivity } from '../composables/useActivity'
import StatsGrid from '../components/dashboard/StatsGrid.vue'
import DashboardCard from '../components/dashboard/DashboardCard.vue'
import StatCard from '../components/dashboard/StatCard.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'

const userStore = useUserStore()
const stats = useStats('admin')
const activity = useActivity()

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
    title: 'Add New User',
    description: 'Create a new user account',
    icon: '➕',
    link: '/admin/users/new',
    buttonText: 'Add User'
  },
  {
    title: 'Network Control',
    description: 'Monitor and manage network settings',
    icon: '🌐',
    link: '/admin/network',
    buttonText: 'Network Settings'
  }
])

const systemStats = computed(() => [
  {
    label: 'System Health',
    key: 'systemHealth',
    icon: '🏥',
    description: 'Overall system performance metrics'
  },
  {
    label: 'Active Users',
    key: 'activeUsers',
    icon: '👥',
    description: 'Current user activity statistics'
  },
  {
    label: 'Network Load',
    key: 'networkLoad',
    icon: '🌐',
    description: 'Network performance and load metrics'
  }
])
</script>
