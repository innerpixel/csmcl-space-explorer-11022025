<script setup>
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import AchievementNotification from './components/achievements/AchievementNotification.vue'
import { useAchievements } from './composables/useAchievements'
import NotificationToast from './components/NotificationToast.vue'

const userStore = useUserStore()
const { activeNotification, dismissNotification } = useAchievements()

// Initialize user state if needed
onMounted(() => {
  if (!userStore.mode) {
    userStore.startExplorer()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NotificationToast />
    <!-- Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
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
    <AchievementNotification
      v-if="activeNotification"
      :achievement="activeNotification"
      @dismiss="dismissNotification"
    />
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
