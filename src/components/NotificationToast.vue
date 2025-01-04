<template>
  <div class="fixed top-4 right-4 z-50">
    <!-- Toast notification container -->
    <div class="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
      <div class="flex-1">
        <slot>
          <!-- Default slot content -->
          <p>Notification message</p>
        </slot>
      </div>
      <!-- Close button -->
      <button 
        @click="$emit('close')" 
        class="text-gray-400 hover:text-white transition-colors"
      >
        <span class="sr-only">Close</span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>
