<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-white">Network</h1>
      <p class="mt-2 text-gray-400">Connect and manage your space network</p>
    </div>

    <div v-if="userStore.isAdmin">
      <!-- Admin Network Controls -->
      <div class="space-y-8">
        <h1 class="text-3xl font-bold text-purple-400">Network Control Panel</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <dashboard-card
            v-for="control in networkControls"
            :key="control.title"
            :title="control.title"
            :icon="control.icon"
            :description="control.description"
            variant="admin"
          >
            {{ control.value }}
          </dashboard-card>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- User Network View -->
      <div class="space-y-8">
        <h1 class="text-3xl font-bold text-blue-400">Your Network</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <dashboard-card
            v-for="stat in networkStats"
            :key="stat.title"
            :title="stat.title"
            :icon="stat.icon"
            :description="stat.description"
          >
            {{ stat.value }}
          </dashboard-card>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Connected Spaces -->
      <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Connected Spaces</h2>
        <div class="space-y-4">
          <p class="text-gray-400 text-sm">No connected spaces yet</p>
        </div>
      </div>

      <!-- Network Settings -->
      <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Network Settings</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-300">Discovery Mode</span>
            <button class="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user'
import DashboardCard from '../components/dashboard/DashboardCard.vue'

const userStore = useUserStore()

const networkControls = computed(() => [
  {
    title: 'Bandwidth Usage',
    icon: '📊',
    description: 'Current network bandwidth utilization',
    value: '78% of allocated'
  },
  {
    title: 'Active Connections',
    icon: '🔌',
    description: 'Number of active network connections',
    value: '1,234 connections'
  }
])

const networkStats = computed(() => [
  {
    title: 'Your Connections',
    icon: '🤝',
    description: 'Active connections to other spaces',
    value: '5 active connections'
  },
  {
    title: 'Data Transfer',
    icon: '📡',
    description: 'Your network usage this month',
    value: '45GB of 100GB used'
  }
])
</script>
