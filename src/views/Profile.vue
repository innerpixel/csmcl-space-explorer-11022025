<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const userStats = computed(() => [
  {
    label: 'Space Size',
    value: userStore.spaceSize || '0 GB',
    icon: '📦',
    description: 'Total space allocated to your account'
  },
  {
    label: 'CSMCL.ID',
    value: userStore.cosmicalEmail || 'Not Set',
    icon: '🆔',
    description: 'Your permanent CSMCL identity'
  },
  {
    label: 'Wallet Status',
    value: userStore.walletStatus || 'Not Connected',
    icon: '💳',
    description: 'Your Flow wallet connection status'
  }
])
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="space-y-8">
      <!-- Profile Header -->
      <div class="text-center">
        <div 
          class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600
                 flex items-center justify-center text-white text-3xl font-medium mb-4"
        >
          {{ userStore.displayName?.[0]?.toUpperCase() || '?' }}
        </div>
        <h1 class="text-2xl font-bold text-white">{{ userStore.displayName }}</h1>
        <p class="text-gray-400 mt-2">{{ userStore.cosmicalEmail }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="stat in userStats"
          :key="stat.label"
          class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 
                 p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
        >
          <div class="flex items-center space-x-4">
            <div class="text-2xl">{{ stat.icon }}</div>
            <div>
              <div class="text-sm text-gray-400">{{ stat.label }}</div>
              <div class="text-lg font-medium text-white">{{ stat.value }}</div>
            </div>
          </div>
          <p class="mt-4 text-sm text-gray-400">{{ stat.description }}</p>
        </div>
      </div>

      <!-- Settings Section -->
      <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
        <h2 class="text-xl font-bold text-white mb-6">Account Settings</h2>
        
        <div class="space-y-6">
          <!-- Display Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              :value="userStore.displayName"
              disabled
              class="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600
                     text-white placeholder-gray-400 disabled:opacity-50"
            >
            <p class="mt-2 text-sm text-gray-400">
              Display name cannot be changed after account creation
            </p>
          </div>

          <!-- CSMCL.ID -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              CSMCL.ID
            </label>
            <input
              type="text"
              :value="userStore.cosmicalEmail"
              disabled
              class="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600
                     text-white placeholder-gray-400 disabled:opacity-50"
            >
            <p class="mt-2 text-sm text-gray-400">
              Your CSMCL.ID is permanent and cannot be changed
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
