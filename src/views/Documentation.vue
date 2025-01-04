`<script setup>
import { ref, onMounted } from 'vue'
import { useDocsStore } from '../stores/docs'
import MarkdownViewer from '../components/MarkdownViewer.vue'

const docsStore = useDocsStore()
const currentSection = ref('getting-started')

const sections = [
  { id: 'getting-started', name: 'Getting Started' },
  { id: 'security', name: 'Security & Recovery' },
  { id: 'email', name: 'Email System' },
  { id: 'blockchain', name: 'Blockchain Integration' },
  { id: 'linux', name: 'Linux Environment' }
]

const changeSection = (sectionId) => {
  currentSection.value = sectionId
  docsStore.setCurrentSection(sectionId)
}

onMounted(() => {
  // Initialize with default content if empty
  if (!docsStore.markdownContent['getting-started']) {
    docsStore.setContent('getting-started', '# Getting Started\n\nWelcome to CSMCL.SPACE...')
    docsStore.setContent('security', '# Security & Recovery\n\nLearn about our security features...')
    docsStore.setContent('email', '# Email System\n\nUnderstand how @csmcl.space works...')
    docsStore.setContent('blockchain', '# Blockchain Integration\n\nFlow Network integration details...')
    docsStore.setContent('linux', '# Linux Environment\n\nYour CSMCL.SPACE system access...')
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Navigation -->
    <nav class="mb-8">
      <ul class="flex space-x-4 overflow-x-auto pb-2">
        <li v-for="section in sections" :key="section.id">
          <button
            @click="changeSection(section.id)"
            class="px-4 py-2 rounded-md text-sm whitespace-nowrap transition-colors"
            :class="[
              currentSection === section.id
                ? 'bg-blue-500/20 text-blue-300'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            ]"
          >
            {{ section.name }}
          </button>
        </li>
      </ul>
    </nav>

    <!-- Content -->
    <div class="bg-gray-900/50 rounded-lg p-6">
      <MarkdownViewer :section="currentSection" />
    </div>
  </div>
</template>`
