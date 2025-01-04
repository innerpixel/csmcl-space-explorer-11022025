<script setup>
import { ref } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { explorerDocumentation } from '../../docs/explorer-content'

const content = ref(marked(explorerDocumentation))
const sanitizedContent = DOMPurify.sanitize(content.value)
</script>

<template>
  <div class="explorer-docs bg-gray-900/50 rounded-lg p-6">
    <div class="prose prose-invert max-w-none">
      <div v-html="sanitizedContent"></div>
    </div>
  </div>
</template>

<style>
.explorer-docs .prose {
  max-width: none;
}

.explorer-docs .prose h1 {
  color: #60A5FA; /* blue-400 */
  margin-bottom: 1.5rem;
}

.explorer-docs .prose h2 {
  color: #93C5FD; /* blue-300 */
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.explorer-docs .prose h3 {
  color: #BFDBFE; /* blue-200 */
  margin-top: 1.5rem;
}

.explorer-docs .prose p {
  color: #E5E7EB; /* gray-200 */
  margin-bottom: 1rem;
}

.explorer-docs .prose ul {
  color: #D1D5DB; /* gray-300 */
  margin-bottom: 1rem;
}

.explorer-docs .prose code {
  color: #34D399; /* emerald-400 */
  background: rgba(52, 211, 153, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}

.explorer-docs .prose pre {
  background: rgba(17, 24, 39, 0.5); /* gray-900 at 50% */
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.explorer-docs .prose pre code {
  color: #D1D5DB; /* gray-300 */
  background: transparent;
  padding: 0;
}
</style>
