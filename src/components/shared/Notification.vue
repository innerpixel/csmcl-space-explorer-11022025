<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed top-4 right-4 z-50">
      <div class="max-w-sm w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto border border-gray-700/50">
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <span v-if="type === 'success'" class="text-green-400 text-xl">✓</span>
              <span v-else-if="type === 'error'" class="text-red-400 text-xl">✕</span>
              <span v-else class="text-blue-400 text-xl">ℹ</span>
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-sm font-medium text-white">{{ title }}</p>
              <p v-if="message" class="mt-1 text-sm text-gray-400">{{ message }}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="close"
                class="inline-flex text-gray-400 hover:text-gray-300"
              >
                <span class="sr-only">Close</span>
                <span class="text-lg">×</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: value => ['success', 'error', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const show = ref(true)
const emit = defineEmits(['close'])

const close = () => {
  show.value = false
  emit('close')
}

watch(() => props.title, () => {
  show.value = true
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>
