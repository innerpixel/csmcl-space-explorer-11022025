<template>
  <stats-grid>
    <stat-card
      v-for="stat in stats"
      :key="stat.label"
      :label="stat.label"
      :value="statValues[stat.key]"
      :icon="stat.icon"
      :description="stat.description"
      :loading="loading"
      :error="error"
      :variant="variant"
    />
  </stats-grid>
</template>

<script setup>
import { computed } from 'vue'
import StatsGrid from './StatsGrid.vue'
import StatCard from './StatCard.vue'

const props = defineProps({
  stats: {
    type: Array,
    required: true
  },
  statValues: {
    type: Object,
    required: true
  },
  loading: Boolean,
  error: String,
  variant: {
    type: String,
    default: 'user'
  }
})
</script>
