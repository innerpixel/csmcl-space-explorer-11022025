`<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  error: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const hasError = computed(() => Boolean(props.error))
</script>

<template>
  <div class="form-control">
    <label v-if="label" class="block text-sm font-medium text-gray-300 mb-1">
      {{ label }}
    </label>
    
    <input
      :type="type"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="w-full rounded-md bg-gray-800/80 border-0 text-white placeholder-gray-500
             shadow-sm shadow-gray-900/50
             hover:ring-2 hover:ring-blue-500/30 hover:shadow-blue-900/20
             focus:ring-2 focus:ring-blue-500/50 focus:shadow-blue-900/30
             transition-all duration-300"
      :class="{ 
        'ring-2 ring-red-500/50 focus:ring-red-500/50': hasError 
      }"
    />
    
    <p v-if="error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>`
