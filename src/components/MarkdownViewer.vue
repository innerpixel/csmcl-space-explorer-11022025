<script setup>
import { computed, ref } from 'vue'
import { useDocsStore } from '../stores/docs'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  section: {
    type: String,
    required: true
  }
})

const showHints = ref(false)

const docsStore = useDocsStore()

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  highlight: function(code, lang) {
    return code
  }
})

const content = computed(() => {
  const raw = docsStore.currentContent
  const html = marked(raw)
  return DOMPurify.sanitize(html)
})

const isEditing = computed(() => docsStore.isEditing)
const rawContent = computed(() => docsStore.currentContent)

const updateContent = (event) => {
  docsStore.setContent(props.section, event.target.value)
}

const mdHints = [
  { syntax: '# Heading 1', desc: 'Main title' },
  { syntax: '## Heading 2', desc: 'Section title' },
  { syntax: '**bold**', desc: 'Bold text' },
  { syntax: '*italic*', desc: 'Italic text' },
  { syntax: '[link](url)', desc: 'Link' },
  { syntax: '- item', desc: 'List item' },
  { syntax: '```code```', desc: 'Code block' },
  { syntax: '> quote', desc: 'Blockquote' }
]
</script>

<template>
  <div class="markdown-container relative">
    <!-- Editor Controls -->
    <div v-if="isEditing" class="space-y-4">
      <div class="flex items-center justify-between">
        <button
          @click="showHints = !showHints"
          class="px-3 py-1.5 text-sm text-gray-400 hover:text-blue-300 
                 transition-colors duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <span>{{ showHints ? 'Hide Hints' : 'Show Hints' }}</span>
        </button>

        <button
          @click="docsStore.toggleEditing()"
          class="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-300 rounded-md 
                 hover:bg-blue-500/30 transition-colors duration-200"
        >
          Preview
        </button>
      </div>

      <!-- Markdown Hints -->
      <div v-if="showHints" class="bg-gray-800/50 rounded-lg border border-gray-700/50 p-3 mb-4">
        <div class="text-sm text-gray-400 mb-2">Common Markdown Elements:</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div 
            v-for="hint in mdHints" 
            :key="hint.syntax"
            class="bg-gray-800/70 rounded p-2 text-sm"
          >
            <code class="text-blue-300 block mb-1">{{ hint.syntax }}</code>
            <span class="text-gray-400 text-xs">{{ hint.desc }}</span>
          </div>
        </div>
      </div>
      
      <textarea
        v-model="rawContent"
        @input="updateContent"
        class="w-full h-[600px] p-4 bg-gray-800/50 text-gray-300 
               rounded-md border border-gray-700/50 focus:outline-none 
               focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
        placeholder="Enter markdown content..."
      ></textarea>
    </div>

    <!-- Preview -->
    <div v-else>
      <div class="flex justify-end mb-4">
        <button
          @click="docsStore.toggleEditing()"
          class="px-3 py-1.5 text-sm text-gray-400 hover:text-blue-300 
                 transition-colors duration-200 flex items-center gap-2"
        >
          <span>Edit</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div 
        class="prose prose-invert prose-blue max-w-none group"
        v-html="content"
      ></div>
    </div>
  </div>
</template>

<style>
.prose {
  @apply text-gray-300;
}

.prose h1 {
  @apply text-white border-b border-gray-800 pb-4 mb-6;
}

.prose h2 {
  @apply text-white border-b border-gray-800/50 pb-2 mt-8;
}

.prose h3 {
  @apply text-gray-100;
}

.prose strong {
  @apply text-white;
}

.prose a {
  @apply text-blue-400 hover:text-blue-300 transition-colors duration-200;
}

.prose code {
  @apply bg-gray-800/50 text-gray-300 px-1.5 py-0.5 rounded-md text-sm;
}

.prose pre {
  @apply bg-gray-800/50 border border-gray-700/50 rounded-lg;
}

.prose pre code {
  @apply bg-transparent p-0 text-gray-300;
}

.prose blockquote {
  @apply border-l-4 border-blue-500/30 bg-blue-500/5 pl-4 py-1 text-gray-400;
}

.prose ul {
  @apply space-y-1;
}

.prose li {
  @apply text-gray-300;
}

.prose table {
  @apply border-collapse w-full;
}

.prose th {
  @apply bg-gray-800/50 text-left py-2 px-4 border border-gray-700/50;
}

.prose td {
  @apply py-2 px-4 border border-gray-700/50;
}
</style>
