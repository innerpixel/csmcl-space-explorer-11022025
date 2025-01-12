<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
    <div class="space-y-8">
      <!-- Welcome Section -->
      <welcome-section
        :title="`Welcome back, ${userStore.displayName}`"
        subtitle="Manage your space and explore the CSMCL network"
      />

      <!-- Quick Actions -->
      <stats-grid>
        <dashboard-card
          v-for="action in quickActions"
          :key="action.title"
          :title="action.title"
          :icon="action.icon"
          :description="action.description"
        >
          <template #footer>
            <router-link
              :to="action.link"
              class="inline-block mt-4 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg
                     hover:bg-blue-500/20 transition-colors duration-300"
            >
              {{ action.buttonText }}
            </router-link>
          </template>
        </dashboard-card>
      </stats-grid>

      <!-- Space Stats -->
      <stats-section
        :stats="spaceStats"
        :stat-values="stats.stats"
        :loading="stats.loading"
        :error="stats.error"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useStats } from '../composables/useStats'
import StatsGrid from '../components/dashboard/StatsGrid.vue'
import DashboardCard from '../components/dashboard/DashboardCard.vue'
import StatsSection from '../components/dashboard/StatsSection.vue'
import WelcomeSection from '../components/dashboard/WelcomeSection.vue'

const userStore = useUserStore()
const stats = useStats('user')

// Prefetch stats when component is mounted
onMounted(() => {
  stats.prefetchStats()
})

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
    key: 'spaceActivity',
    icon: '🌟',
    description: 'Interactions and chatter traffic in your space'
  },
  {
    label: 'Network',
    key: 'networkStats',
    icon: '🔗',
    description: 'Active connections and pending requests'
  },
  {
    label: 'Transactions',
    key: 'transactionStats',
    icon: '⚡',
    description: 'Total sent and received transactions'
  }
])
</script>
