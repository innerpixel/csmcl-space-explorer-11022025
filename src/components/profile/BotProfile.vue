<template>
  <div class="space-y-6">
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <img :src="botAvatar" class="h-16 w-16 rounded-full" :alt="bot.displayName">
        </div>
        <div>
          <h2 class="text-xl font-bold text-white">{{ bot.displayName }}</h2>
          <p class="text-gray-400">{{ bot.description }}</p>
        </div>
      </div>
    </div>

    <!-- Bot Features -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Achievements -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Achievements</h3>
        <div class="space-y-2">
          <div v-for="achievement in bot.metrics.achievements" :key="achievement" 
               class="flex items-center space-x-2 text-gray-300">
            <span class="text-green-400">✓</span>
            <span>{{ formatAchievement(achievement) }}</span>
          </div>
        </div>
      </div>

      <!-- Level Progress -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Progress</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm text-gray-400">
              <span>Level: {{ bot.metrics.level }}</span>
              <span>XP: {{ bot.metrics.xp }}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div class="bg-blue-500 rounded-full h-2" :style="{ width: xpProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Features -->
    <div class="bg-gray-800 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-white mb-4">Learn from {{ bot.displayName }}</h3>
      <div class="space-y-4">
        <button v-for="feature in botFeatures" :key="feature.id"
                @click="startFeature(feature)"
                class="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          <div class="font-medium text-white">{{ feature.title }}</div>
          <div class="text-sm text-gray-400">{{ feature.description }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/user'

const props = defineProps({
  botName: {
    type: String,
    required: true
  }
})

const userStore = useUserStore()

// Get bot data from userDb
const bot = computed(() => {
  return userStore.getUser(props.botName) || {}
})

// Calculate XP progress (example calculation)
const xpProgress = computed(() => {
  const xp = bot.value.metrics?.xp || 0
  const levelThreshold = 1000 // Example threshold
  return Math.min((xp / levelThreshold) * 100, 100)
})

// Bot-specific features based on level
const botFeatures = computed(() => {
  switch(bot.value.metrics?.level) {
    case 'novice':
      return [
        {
          id: 'tour',
          title: 'Take a Guided Tour',
          description: 'Let me show you around the basics of CSMCL Space'
        },
        {
          id: 'first_steps',
          title: 'First Steps',
          description: 'Learn how to complete your profile and get started'
        }
      ]
    case 'explorer':
      return [
        {
          id: 'network',
          title: 'Network Building',
          description: 'Learn advanced networking features and strategies'
        },
        {
          id: 'challenges',
          title: 'Space Challenges',
          description: 'Take on explorer-level challenges and earn achievements'
        }
      ]
    case 'master':
      return [
        {
          id: 'advanced',
          title: 'Advanced Features',
          description: 'Discover master-level tools and capabilities'
        },
        {
          id: 'community',
          title: 'Community Leadership',
          description: 'Learn how to contribute and lead in the community'
        }
      ]
    default:
      return []
  }
})

// Generate avatar URL based on bot name
const botAvatar = computed(() => {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${bot.value.cosmicalName}`
})

// Format achievement text
const formatAchievement = (achievement) => {
  return achievement
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Handle feature interaction
const startFeature = (feature) => {
  // TODO: Implement feature-specific interactions
  console.log(`Starting feature: ${feature.title}`)
  // This would trigger different interactions based on the feature
}
</script>
