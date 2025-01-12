<template>
  <div class="text-center">
    <h1 
      :class="[
        'text-3xl font-bold',
        variant === 'admin' ? 'text-purple-400' : 'text-white'
      ]"
    >
      {{ title }}
    </h1>
    <p class="mt-2 text-gray-400">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'user',
    validator: (value) => ['user', 'admin'].includes(value)
  }
})
</script>
