<template>
  <div class="space-y-8">
    <!-- Profile Header -->
    <ProfileHeader />

    <!-- Level and XP Banner -->
    <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 backdrop-blur-sm border border-blue-500/20">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">{{ currentLevel }}</h2>
          <p class="text-gray-400">Explorer Level</p>
        </div>
        <div class="text-right">
          <p class="text-xl font-semibold text-yellow-400">{{ totalXP }} XP</p>
          <p v-if="nextLevel" class="text-sm text-gray-400">
            {{ nextLevel.xpRequired - totalXP }} XP to {{ nextLevel.level }}
          </p>
        </div>
      </div>
      <div class="mt-4">
        <div class="w-full bg-gray-700/30 rounded-full h-2">
          <div class="bg-blue-500 h-2 rounded-full transition-all duration-500"
               :style="{ width: `${levelProgress}%` }"></div>
        </div>
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

    <!-- Achievements Section -->
    <div class="mt-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">Achievements & Progress</h2>
      </div>
      <AchievementsPanel />
    </div>

    <!-- Explorer Features Progress -->
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
import AchievementsPanel from './AchievementsPanel.vue'
import { useAchievements } from '../../composables/useAchievements'

const userStore = useUserStore()
const { totalXP, currentLevel, levelProgress, nextLevel } = useAchievements()

const userStats = computed(() => [
  {
    label: 'Activity',
    icon: '📊',
    value: userStore.spaceActivity,
    description: 'Your space activity metrics'
  },
  {
    label: 'Network',
    icon: '🌐',
    value: userStore.networkStats,
    description: 'Your network connections'
  },
  {
    label: 'Transactions',
    icon: '💫',
    value: userStore.transactionStats,
    description: 'Your transaction history'
  }
])
</script>
