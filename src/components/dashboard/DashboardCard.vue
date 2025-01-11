<template>
  <div 
    :class="[
      'bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6',
      'hover:shadow-xl transition-all duration-500',
      variant === 'admin' ? 'hover:shadow-purple-900/5' : 'hover:shadow-blue-900/5'
    ]"
  >
    <div v-if="icon || title" class="flex items-center justify-between mb-4">
      <div v-if="icon" class="text-3xl">{{ icon }}</div>
      <h3 v-if="title" class="text-lg font-medium text-white">{{ title }}</h3>
      <div v-if="timestamp" class="text-xs text-gray-500">{{ timestamp }}</div>
    </div>
    
    <slot />

    <p v-if="description" class="text-xs text-gray-500 mt-3">{{ description }}</p>

    <slot name="footer" />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: String,
  description: String,
  timestamp: String,
  variant: {
    type: String,
    default: 'user',
    validator: (value) => ['user', 'admin'].includes(value)
  }
})
</script>
