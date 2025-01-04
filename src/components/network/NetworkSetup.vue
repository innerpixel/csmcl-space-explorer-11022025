<template>
  <div class="space-y-8">
    <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
      <h2 class="text-xl font-semibold text-white mb-4">Network Setup</h2>
      
      <!-- Network Configuration -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Network Visibility
          </label>
          <select
            v-model="networkConfig.visibility"
            class="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="public">Public Network</option>
            <option value="private">Private Network</option>
            <option value="invite">Invite Only</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Connection Preferences
          </label>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="networkConfig.autoAccept"
                class="rounded bg-gray-900/50 border-gray-700 text-blue-500"
              >
              <span class="text-gray-300">Auto-accept connections from verified users</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="networkConfig.notifyNewConnections"
                class="rounded bg-gray-900/50 border-gray-700 text-blue-500"
              >
              <span class="text-gray-300">Notify me about new connection requests</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Discovery Settings
          </label>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="networkConfig.discoverable"
                class="rounded bg-gray-900/50 border-gray-700 text-blue-500"
              >
              <span class="text-gray-300">Make my space discoverable</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="networkConfig.suggestConnections"
                class="rounded bg-gray-900/50 border-gray-700 text-blue-500"
              >
              <span class="text-gray-300">Suggest connections based on interests</span>
            </label>
          </div>
        </div>

        <button
          @click="saveNetworkSettings"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg
                 transition-colors duration-300"
        >
          Save Network Settings
        </button>
      </div>
    </div>

    <!-- Network Stats -->
    <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
      <h3 class="text-lg font-medium text-white mb-4">Network Statistics</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-gray-900/50 rounded-lg p-4">
          <div class="text-sm text-gray-400">Connected Spaces</div>
          <div class="text-2xl font-semibold text-white">
            {{ userStore.networkStats.connections }}
          </div>
        </div>
        <div class="bg-gray-900/50 rounded-lg p-4">
          <div class="text-sm text-gray-400">Pending Requests</div>
          <div class="text-2xl font-semibold text-white">
            {{ userStore.networkStats.pending }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'
import { useAchievements } from '../../composables/useAchievements'

const userStore = useUserStore()
const { unlockAchievement } = useAchievements()

const networkConfig = ref({
  visibility: 'private',
  autoAccept: false,
  notifyNewConnections: true,
  discoverable: false,
  suggestConnections: true
})

const saveNetworkSettings = async () => {
  try {
    await userStore.updateProfile({
      network: networkConfig.value
    })

    // Trigger network setup achievement
    await unlockAchievement('network-pioneer')

    // Additional achievements based on configuration
    if (networkConfig.value.visibility === 'public') {
      await unlockAchievement('network-ambassador')
    }
    
    if (networkConfig.value.discoverable) {
      await unlockAchievement('space-explorer')
    }

    // Update step progress
    if (userStore.stepProgress?.network) {
      userStore.stepProgress.network.completed = true
      userStore.stepProgress.network.progress = 100
    }
  } catch (error) {
    console.error('Failed to save network settings:', error)
  }
}
</script>
