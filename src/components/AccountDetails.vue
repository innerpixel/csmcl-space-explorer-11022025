<script setup>
import { useUserStore } from '../stores/user'
import { ref } from 'vue'

const userStore = useUserStore()
const showSensitiveInfo = ref(false)

const toggleSensitiveInfo = () => {
  showSensitiveInfo.value = !showSensitiveInfo.value
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <!-- Business Card -->
    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 shadow-xl">
      <!-- Main Info -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
          <span class="text-2xl font-bold text-blue-400">
            {{ userStore.registrationData?.cosmicalName?.[0]?.toUpperCase() || '?' }}
          </span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-2">
          {{ userStore.registrationData?.cosmicalName }}
        </h3>
        <p class="font-mono text-blue-400 text-sm">
          {{ userStore.registrationData?.cosmicalEmail }}
        </p>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-700/50 my-6"></div>

      <!-- Registration Info -->
      <div class="space-y-4">
        <!-- Public Info -->
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-400">Member Since</span>
          <span class="text-white">
            {{ new Date(userStore.registrationData?.registeredAt).toLocaleDateString() }}
          </span>
        </div>

        <!-- Sensitive Info (Hidden by Default) -->
        <div v-if="showSensitiveInfo" class="space-y-4 pt-4 border-t border-gray-700/50">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-400">SIM Number</span>
            <span class="text-white font-mono">{{ userStore.registrationData?.simNumber }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-400">Verification Email</span>
            <span class="text-white">{{ userStore.registrationData?.regularEmail }}</span>
          </div>
        </div>

        <!-- Toggle Button -->
        <button
          @click="toggleSensitiveInfo"
          class="w-full mt-4 px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/30 rounded-md transition-colors duration-200"
        >
          {{ showSensitiveInfo ? 'Hide Details' : 'Show Details' }}
        </button>
      </div>
    </div>
  </div>
</template>
