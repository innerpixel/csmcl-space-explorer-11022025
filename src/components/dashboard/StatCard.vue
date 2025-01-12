<template>
  <dashboard-card
    :icon="icon"
    :title="label"
    :description="description"
    :timestamp="timestamp"
    :variant="variant"
  >
    <div v-if="loading" class="flex justify-center items-center py-4">
      <loading-spinner />
    </div>
    
    <div v-else-if="error" class="text-red-400 text-sm py-2">
      {{ error }}
    </div>
    
    <div v-else class="mt-2 space-y-1">
      <template v-if="typeof value === 'object'">
        <div 
          v-for="(val, key) in value" 
          :key="key"
          class="flex justify-between items-center"
        >
          <span class="text-sm text-gray-400 capitalize">{{ key }}</span>
          <span class="text-sm font-medium text-white">{{ val }}</span>
        </div>
      </template>
      <template v-else>
        <p class="text-gray-400">{{ value }}</p>
      </template>
    </div>
  </dashboard-card>
</template>

<script setup>
import { defineProps } from 'vue'
import DashboardCard from './DashboardCard.vue'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

defineProps({
  label: String,
  value: [String, Number, Object],
  icon: String,
  description: String,
  timestamp: {
    type: String,
    default: 'Last 24h'
  },
  loading: Boolean,
  error: String,
  variant: {
    type: String,
    default: 'user'
  }
})
</script>
