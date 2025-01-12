<template>
  <div>
    <div v-if="loading" class="flex justify-center py-8">
      <loading-spinner />
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="(item, index) in activities"
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
  </div>
</template>

<script setup>
import LoadingSpinner from '../shared/LoadingSpinner.vue'

defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
