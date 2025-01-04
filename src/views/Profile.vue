<template>
  <div class="max-w-4xl mx-auto px-4 py-8 pt-24">
    <Suspense>
      <template #default>
        <component :is="currentProfileComponent" />
      </template>
      <template #fallback>
        <div class="flex justify-center items-center h-[60vh]">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import ExplorerProfile from '../components/profile/ExplorerProfile.vue'
import UserProfile from '../components/profile/UserProfile.vue'
import AdminProfile from '../components/profile/AdminProfile.vue'

const userStore = useUserStore()

const currentProfileComponent = computed(() => {
  if (userStore.isAdmin) return AdminProfile
  if (userStore.isExplorer) return ExplorerProfile
  return UserProfile
})
</script>
