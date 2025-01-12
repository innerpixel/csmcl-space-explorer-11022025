<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
    <div class="space-y-8">
      <!-- Welcome Section -->
      <welcome-section
        title="Admin Dashboard"
        subtitle="Monitor system health and manage users"
        variant="admin"
      />

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
      <stats-section
        :stats="systemStats"
        :stat-values="stats.stats"
        :loading="stats.loading?.value || false"
        :error="stats.error?.value"
        variant="admin"
      />

      <!-- Recent Activity -->
      <div class="bg-gray-800/50 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <activity-feed :activities="activity.activities" :loading="activity.loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStats } from '../composables/useStats'
import { useActivity } from '../composables/useActivity'
import StatsGrid from '../components/dashboard/StatsGrid.vue'
import DashboardCard from '../components/dashboard/DashboardCard.vue'
import StatsSection from '../components/dashboard/StatsSection.vue'
import WelcomeSection from '../components/dashboard/WelcomeSection.vue'
import ActivityFeed from '../components/dashboard/ActivityFeed.vue'

const stats = useStats('admin')
const activity = useActivity()

// Prefetch stats when component is mounted
onMounted(() => {
  stats.prefetchStats()
})

const quickActions = computed(() => [
  {
    title: 'System Metrics',
    description: 'View detailed system performance metrics',
    icon: '📊',
    link: '/admin/metrics',
    buttonText: 'View Metrics'
  },
  {
    title: 'User Management',
    description: 'Manage user accounts and permissions',
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
    description: 'Monitor and manage network connections',
    icon: '🌐',
    link: '/admin/network',
    buttonText: 'View Network'
  }
])

const systemStats = computed(() => [
  {
    label: 'System Health',
    key: 'systemHealth',
    icon: '💪',
    description: 'Overall system performance and stability'
  },
  {
    label: 'Active Users',
    key: 'activeUsers',
    icon: '👥',
    description: 'Currently active and new users'
  },
  {
    label: 'Network Load',
    key: 'networkLoad',
    icon: '📡',
    description: 'Current network usage and capacity'
  }
])
</script>
