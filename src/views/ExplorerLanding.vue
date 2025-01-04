<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      <!-- Welcome Section -->
      <div class="text-center mb-16">
        <div class="mb-8">
          <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                      flex items-center justify-center text-white text-3xl font-bold mb-6">
            CE
          </div>
          <h1 class="text-4xl font-bold text-white mb-4">
            Welcome to Explorer Mode
          </h1>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            You have 10 days to explore and experiment with CSMCL features. Let's get started!
          </p>
          <div class="mt-4 text-yellow-500/80">
            Session expires in {{ explorerTimeLeft }}
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div
          v-for="action in quickActions" 
          :key="action.name"
          @click="handleQuickAction(action)"
          class="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm
                 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer">
          <div class="text-3xl mb-4">{{ action.icon }}</div>
          <h3 class="text-lg font-semibold text-white mb-2">{{ action.name }}</h3>
          <p class="text-gray-400 text-sm">{{ action.description }}</p>
        </div>
      </div>

      <!-- Feature Progress -->
      <div class="bg-gray-800/30 rounded-xl border border-gray-700/50 p-8 backdrop-blur-sm">
        <h2 class="text-2xl font-bold text-white mb-6">Explorer Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="feature in explorerFeatures" :key="feature.name" class="space-y-2">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-300 font-medium">{{ feature.name }}</span>
              <span class="text-sm" :class="feature.complete ? 'text-green-400' : 'text-gray-500'">
                {{ feature.complete ? 'Complete' : 'Pending' }}
              </span>
            </div>
            <div class="w-full bg-gray-700/30 rounded-full h-2">
              <div class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                   :style="{ width: `${feature.progress}%` }"></div>
            </div>
            <p class="text-sm text-gray-500">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const explorerTimeLeft = computed(() => {
  if (!userStore.explorerExpiry) return 'Not set'
  
  const expiryDate = new Date(userStore.explorerExpiry)
  if (isNaN(expiryDate.getTime())) return 'Invalid date'
  
  const timeLeft = Math.max(0, expiryDate.getTime() - Date.now())
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h`
  }
  return 'Expired'
})

const quickActions = [
  {
    name: 'Configure Space',
    icon: '🌟',
    description: 'Set up your space preferences and appearance',
    path: '/onboarding/space'
  },
  {
    name: 'View Profile',
    icon: '👤',
    description: 'Check your explorer profile and progress',
    path: '/profile'
  },
  {
    name: 'Read Docs',
    icon: '📚',
    description: 'Learn more about CSMCL features and capabilities',
    path: '/documentation'
  }
]

const explorerFeatures = computed(() => [
  {
    name: 'Space Configuration',
    progress: userStore.stepProgress?.space?.progress || 0,
    complete: userStore.stepProgress?.space?.completed || false,
    description: 'Configure your space settings and preferences'
  },
  {
    name: 'Network Setup',
    progress: userStore.stepProgress?.network?.progress || 0,
    complete: userStore.stepProgress?.network?.completed || false,
    description: 'Set up your network settings'
  }
])

const handleQuickAction = (action) => {
  router.push(action.path).catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
    }
  })
}

const handleExplorerLogin = async () => {
  if (form.cosmicalName.trim()) {
    const success = await userStore.loginAsExplorer(form.cosmicalName.trim())
    if (success) {
      router.push('/explorer')
    }
  }
}
</script>
