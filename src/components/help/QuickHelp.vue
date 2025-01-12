<template>
  <div class="quick-help bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
    <h2 class="text-2xl font-bold text-white mb-6">Quick Help</h2>
    
    <div class="space-y-6">
      <!-- Basic Navigation -->
      <section>
        <h3 class="text-lg font-semibold text-white mb-3">Basic Navigation</h3>
        <ul class="space-y-2 text-gray-300">
          <li>📊 <strong>Dashboard:</strong> View your space metrics and progress</li>
          <li>👤 <strong>Profile:</strong> Manage your account settings</li>
          <li>🚀 <strong>Explore:</strong> Discover new space features</li>
        </ul>
      </section>

      <!-- Common Tasks -->
      <section>
        <h3 class="text-lg font-semibold text-white mb-3">Common Tasks</h3>
        <ul class="space-y-2 text-gray-300">
          <li>✏️ <strong>Edit Profile:</strong> Update your display name and email</li>
          <li>🔑 <strong>Security:</strong> Change your recovery phrase</li>
          <li>📱 <strong>Preferences:</strong> Customize your experience</li>
        </ul>
      </section>

      <!-- Need More Help? -->
      <section class="border-t border-gray-700/50 pt-4">
        <h3 class="text-lg font-semibold text-white mb-3">Need More Help?</h3>
        <button
          @click="loadDetailedDocs"
          class="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
        >
          View Detailed Documentation
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useExternalDocs } from '../../composables/useExternalDocs'

const { fetchDocumentation } = useExternalDocs()

const loadDetailedDocs = async () => {
  window.open('https://innerpixel.github.io/csmcl-space-explorer-11022025/user/guide', '_blank')
}
</script>
