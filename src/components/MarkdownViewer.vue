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

const showCheatSheet = ref(false)
const activeTab = ref('basic')

const docsStore = useDocsStore()

const content = computed(() => {
  const raw = docsStore.markdownContent[props.section] || ''
  return DOMPurify.sanitize(marked(raw))
})

const isEditing = computed(() => docsStore.isEditing)
const rawContent = computed(() => docsStore.markdownContent[props.section] || '')

const updateContent = (event) => {
  docsStore.setContent(props.section, event.target.value)
}

const markdownBasics = [
  { syntax: '# Heading 1', description: 'Main title' },
  { syntax: '## Heading 2', description: 'Section title' },
  { syntax: '### Heading 3', description: 'Subsection' },
  { syntax: '**bold**', description: 'Bold text' },
  { syntax: '*italic*', description: 'Italic text' },
  { syntax: '***bold italic***', description: 'Bold and italic' },
  { syntax: '~~strikethrough~~', description: 'Strikethrough' },
  { syntax: '> quote', description: 'Blockquote' },
  { syntax: '---', description: 'Horizontal line' }
]

const markdownLists = [
  { syntax: '- item', description: 'Bullet list' },
  { syntax: '  - nested', description: 'Nested bullet' },
  { syntax: '1. item', description: 'Numbered list' },
  { syntax: '  1. nested', description: 'Nested number' },
  { syntax: '- [ ] task', description: 'Todo (unchecked)' },
  { syntax: '- [x] task', description: 'Todo (checked)' }
]

const markdownLinks = [
  { syntax: '[link](url)', description: 'Basic link' },
  { syntax: '[link](url "title")', description: 'Link with title' },
  { syntax: '![alt](image-url)', description: 'Image' },
  { syntax: '[![alt](img-url)](link-url)', description: 'Linked image' },
  { syntax: '<https://url.com>', description: 'Auto-link' }
]

const markdownCode = [
  { syntax: '`inline code`', description: 'Inline code' },
  { syntax: '```language\ncode block\n```', description: 'Code block' },
  { syntax: '    code block', description: 'Indented code' },
  { syntax: '```js\nconst x = 1;\n```', description: 'JavaScript' },
  { syntax: '```python\ndef fn():\n```', description: 'Python' }
]

const markdownTables = [
  { 
    syntax: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |',
    description: 'Basic table'
  },
  { 
    syntax: '| Left | Center | Right |\n|:-----|:------:|------:|\n|Text  | Text   | Text  |',
    description: 'Aligned table'
  }
]

const markdownExtended = [
  { syntax: 'Term\n: Definition', description: 'Definition list' },
  { syntax: 'H~2~O', description: 'Subscript' },
  { syntax: 'X^2^', description: 'Superscript' },
  { syntax: '==highlight==', description: 'Highlight' },
  { syntax: ':emoji:', description: 'Emoji code' }
]
</script>

<template>
  <div class="markdown-container">
    <!-- Editor Controls -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-4">
        <button
          @click="docsStore.toggleEditing()"
          class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 
                 transition-colors duration-200 shadow-lg shadow-gray-900/20"
        >
          {{ isEditing ? 'Preview' : 'Edit' }}
        </button>
        
        <!-- Markdown Cheat Sheet Button -->
        <button
          v-if="isEditing"
          @click="showCheatSheet = !showCheatSheet"
          class="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors
                 hover:bg-gray-800/50 rounded-md"
        >
          {{ showCheatSheet ? 'Hide Syntax Help' : 'Show Syntax Help' }}
        </button>
      </div>
    </div>

    <!-- Markdown Cheat Sheet -->
    <div
      v-if="isEditing && showCheatSheet"
      class="mb-4 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden"
    >
      <!-- Tabs -->
      <div class="flex border-b border-gray-700">
        <button
          v-for="(tab, name) in {
            basic: 'Basic',
            lists: 'Lists',
            links: 'Links',
            code: 'Code',
            tables: 'Tables',
            extended: 'Extended'
          }"
          :key="name"
          @click="activeTab = name"
          class="px-4 py-2 text-sm transition-colors"
          :class="[
            activeTab === name
              ? 'bg-gray-800 text-white font-medium'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Content -->
      <div class="p-4">
        <div v-if="activeTab === 'basic'" class="syntax-grid">
          <template v-for="item in markdownBasics" :key="item.syntax">
            <div class="syntax-item">
              <code class="syntax">{{ item.syntax }}</code>
              <span class="description">{{ item.description }}</span>
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'lists'" class="syntax-grid">
          <template v-for="item in markdownLists" :key="item.syntax">
            <div class="syntax-item">
              <code class="syntax">{{ item.syntax }}</code>
              <span class="description">{{ item.description }}</span>
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'links'" class="syntax-grid">
          <template v-for="item in markdownLinks" :key="item.syntax">
            <div class="syntax-item">
              <code class="syntax">{{ item.syntax }}</code>
              <span class="description">{{ item.description }}</span>
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'code'" class="syntax-grid">
          <template v-for="item in markdownCode" :key="item.syntax">
            <div class="syntax-item">
              <code class="syntax">{{ item.syntax }}</code>
              <span class="description">{{ item.description }}</span>
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'tables'" class="syntax-grid">
          <template v-for="item in markdownTables" :key="item.syntax">
            <div class="syntax-item col-span-2">
              <code class="syntax whitespace-pre">{{ item.syntax }}</code>
              <span class="description">{{ item.description }}</span>
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'extended'" class="syntax-grid">
          <template v-for="item in markdownExtended" :key="item.syntax">
            <div class="syntax-item">
              <code class="syntax">{{ item.syntax }}</code>
              <span class="description">{{ item.description }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div v-if="isEditing" class="editor-container">
      <textarea
        v-model="rawContent"
        @input="updateContent"
        class="w-full h-64 p-4 bg-gray-800 text-white rounded-lg border border-gray-700 
               focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
               font-mono text-sm resize-y shadow-lg shadow-gray-900/20"
        placeholder="Enter markdown content..."
      ></textarea>
    </div>

    <!-- Preview -->
    <div
      v-else
      class="prose prose-invert max-w-none"
      v-html="content"
    ></div>
  </div>
</template>

<style>
.prose {
  @apply text-gray-300;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply text-white font-bold mt-8 mb-4;
}

.prose h1 {
  @apply text-3xl;
}

.prose h2 {
  @apply text-2xl;
}

.prose h3 {
  @apply text-xl;
}

.prose p {
  @apply mb-4;
}

.prose a {
  @apply text-blue-400 hover:text-blue-300 transition-colors duration-200;
}

.prose ul,
.prose ol {
  @apply my-4 pl-6;
}

.prose li {
  @apply mb-2;
}

.prose code {
  @apply bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300;
}

.prose pre {
  @apply bg-gray-800 p-4 rounded-lg overflow-x-auto my-4 shadow-lg shadow-gray-900/20;
}

.prose pre code {
  @apply bg-transparent p-0 text-gray-300;
}

.prose blockquote {
  @apply border-l-4 border-gray-700 pl-4 my-4 italic text-gray-400;
}

.prose hr {
  @apply border-gray-700 my-8;
}

.prose table {
  @apply w-full my-6 border-collapse;
}

.prose th,
.prose td {
  @apply border border-gray-700 px-4 py-2;
}

.prose th {
  @apply bg-gray-800 font-semibold;
}

.prose img {
  @apply rounded-lg max-w-full my-4 shadow-lg shadow-gray-900/20;
}

/* Syntax Guide Styles */
.syntax-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-3;
}

.syntax-item {
  @apply flex flex-col space-y-1;
}

.syntax {
  @apply text-blue-300 bg-gray-800/80 px-2 py-1.5 rounded font-mono text-sm
         shadow-sm shadow-gray-900/10 border border-gray-700/50;
}

.description {
  @apply text-gray-400 text-sm;
}

/* Add subtle hover effects */
.syntax-item:hover .syntax {
  @apply bg-gray-800 border-gray-700;
}

.syntax-item:hover .description {
  @apply text-gray-300;
}

/* Transitions */
.syntax-item {
  @apply transition-all duration-200;
}

/* Scrollbar Styling */
textarea::-webkit-scrollbar {
  @apply w-2;
}

textarea::-webkit-scrollbar-track {
  @apply bg-gray-900/50 rounded-r;
}

textarea::-webkit-scrollbar-thumb {
  @apply bg-gray-700 rounded hover:bg-gray-600 transition-colors;
}
</style>
