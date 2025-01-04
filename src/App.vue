<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import Navbar from './components/Navbar.vue'

const userStore = useUserStore()
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="flex-1 w-full">
      <RouterView v-slot="{ Component }">
        <transition
          name="fade"
          mode="out-in"
          appear
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
body {
  @apply bg-gray-900;
  margin: 0;
  padding: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
