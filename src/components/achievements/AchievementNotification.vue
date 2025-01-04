<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed bottom-0 right-0 mb-4 mr-4 max-w-sm w-full bg-gray-800/90 backdrop-blur-lg 
             shadow-lg rounded-lg pointer-events-auto border border-blue-500/20"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0 pt-0.5">
            <div class="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-2xl">
              {{ achievement.icon }}
            </div>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-white">
              Achievement Unlocked!
            </p>
            <p class="mt-1 text-sm text-gray-300">
              {{ achievement.name }}
            </p>
            <p class="mt-1 text-xs text-yellow-400">
              +{{ achievement.xp }} XP
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="dismiss"
              class="bg-gray-700/50 rounded-md inline-flex text-gray-400 hover:text-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  achievement: {
    type: Object,
    required: true
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const show = ref(false)
const emit = defineEmits(['dismiss'])

const dismiss = () => {
  show.value = false
  emit('dismiss')
}

onMounted(() => {
  show.value = true
  if (props.duration > 0) {
    setTimeout(() => {
      dismiss()
    }, props.duration)
  }
})
</script>
