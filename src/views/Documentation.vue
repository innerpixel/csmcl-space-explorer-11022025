<script setup>
import { computed, ref } from 'vue'
import { useDocsStore } from '../stores/docs'
import { useUserStore } from '../stores/user'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import ExplorerDocs from '../components/documentation/ExplorerDocs.vue'

const docsStore = useDocsStore()
const userStore = useUserStore()

const currentSection = computed(() => docsStore.currentSection)
const sections = computed(() => docsStore.availableSections)
const navigationLinks = computed(() => docsStore.navigationLinks)
const isResetting = ref(false)
const isExplorer = computed(() => userStore.isExplorer)

const changeSection = (sectionId) => {
  docsStore.setCurrentSection(sectionId)
}

const resetDocs = async () => {
  try {
    isResetting.value = true
    // Clear localStorage first
    localStorage.removeItem('docs')
    // Reset the store
    docsStore.reset()
    // Briefly wait to show the animation
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Failed to reset docs:', error)
  } finally {
    isResetting.value = false
  }
}
</script>

<template>
  <div class="documentation-container min-h-screen bg-gray-900/30">
    <div class="max-w-7xl mx-auto px-4 py-8 pt-24">
      <!-- Explorer Documentation -->
      <div v-if="isExplorer || $route.meta.showExplorerDocs" class="flex flex-col gap-8">
        <div class="bg-blue-500/20 text-blue-300 px-4 py-3 rounded-lg">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            <span>Explorer Mode Documentation</span>
          </div>
        </div>
        <ExplorerDocs />
      </div>

      <!-- Regular Documentation -->
      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="sticky-nav bg-gray-900/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">Documentation</h2>
              <button
                @click="resetDocs"
                :disabled="isResetting"
                class="text-sm text-gray-400 hover:text-blue-300 transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'animate-spin': isResetting }"
                title="Reset documentation content"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"
                     :class="{ 'opacity-0': isResetting }">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                <!-- Loading spinner -->
                <svg v-if="isResetting" class="animate-spin h-4 w-4 absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>
            <ul class="space-y-2">
              <li v-for="section in navigationLinks" :key="section.id">
                <button
                  @click="changeSection(section.id)"
                  class="w-full text-left px-4 py-2 rounded-md text-sm transition-colors duration-200"
                  :class="[
                    section.isActive
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  ]"
                >
                  {{ section.title }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Content -->
        <main class="flex-grow">
          <div class="bg-gray-900/50 rounded-lg p-6">
            <div v-if="isResetting" class="flex items-center justify-center py-12">
              <div class="text-gray-400">Refreshing content...</div>
            </div>
            <MarkdownViewer v-else :section="currentSection" />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.documentation-container {
  min-height: calc(100vh - var(--navbar-height, 64px));
  padding-top: var(--navbar-height, 64px);
}

.sticky-nav {
  position: sticky;
  top: calc(var(--navbar-height, 64px) + 1rem);
  max-height: calc(100vh - var(--navbar-height, 64px) - 2rem);
  overflow-y: auto;
}

/* Scrollbar styling */
.sticky-nav::-webkit-scrollbar {
  width: 4px;
}

.sticky-nav::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.sticky-nav::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

.sticky-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

/* Firefox scrollbar */
.sticky-nav {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.5) rgba(0, 0, 0, 0.1);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
