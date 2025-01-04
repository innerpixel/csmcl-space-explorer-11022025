<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const userStore = useUserStore()

const cosmicalName = ref(userStore.csmclId.cosmicalName || '')
const cosmicalEmail = ref(userStore.csmclId.cosmicalEmail || '')
const recoveryPhrase = ref('')
const showRecoveryPhrase = ref(false)
const confirmationChecked = ref(false)

const spacePreview = computed(() => {
  const space = userStore.space
  return {
    theme: spaceThemes.find(t => t.id === space.theme)?.name || '',
    template: spaceTemplates.find(t => t.id === space.template)?.name || '',
    visibility: space.visibility,
    size: space.boundaries.size
  }
})

const spaceThemes = [
  { id: 'cosmic', name: 'Cosmic Void' },
  { id: 'cyber', name: 'Cyber Grid' },
  { id: 'nature', name: 'Natural Haven' },
  { id: 'abstract', name: 'Abstract Realm' }
]

const spaceTemplates = [
  { id: 'gallery', name: 'Digital Gallery' },
  { id: 'hub', name: 'Social Hub' },
  { id: 'studio', name: 'Creative Studio' },
  { id: 'sanctuary', name: 'Personal Sanctuary' }
]

const isValid = computed(() => 
  cosmicalName.value &&
  cosmicalEmail.value &&
  recoveryPhrase.value.split(' ').length >= 12 &&
  confirmationChecked.value
)

const generateRecoveryPhrase = () => {
  // In production, this should use a secure method to generate the recovery phrase
  const words = [
    'cosmic', 'digital', 'quantum', 'stellar', 'nebula', 'photon',
    'quasar', 'galaxy', 'neutron', 'plasma', 'atomic', 'cosmic',
    'void', 'space', 'time', 'energy'
  ]
  const selected = []
  while (selected.length < 12) {
    const word = words[Math.floor(Math.random() * words.length)]
    if (!selected.includes(word)) {
      selected.push(word)
    }
  }
  recoveryPhrase.value = selected.join(' ')
}

const confirmCsmclId = async () => {
  await userStore.setupCsmclId({
    cosmicalName: cosmicalName.value,
    cosmicalEmail: cosmicalEmail.value,
    recoveryPhrase: recoveryPhrase.value
  })
  
  await userStore.confirmCsmclId()
  userStore.completeStep('csmclId')
}

// Generate recovery phrase on component mount
generateRecoveryPhrase()
</script>

<template>
  <div class="csmcl-id-confirmation max-w-4xl mx-auto p-6">
    <h2 class="text-3xl font-bold text-white mb-8">Confirm Your CSMCL.ID</h2>

    <!-- Warning Message -->
    <div class="mb-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
      <p class="text-yellow-200 font-medium">
        Important: This step will permanently establish your presence in the Cosmical Space.
        Your CSMCL.ID, name, and core space characteristics cannot be changed after confirmation.
      </p>
    </div>

    <!-- Identity Review -->
    <section class="mb-10">
      <h3 class="text-xl font-semibold text-white mb-4">Identity Review</h3>
      
      <div class="grid gap-6">
        <!-- Cosmical Name -->
        <div>
          <label class="block text-white mb-2">Cosmical Name</label>
          <input
            type="text"
            v-model="cosmicalName"
            class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
            placeholder="Your permanent Cosmical name"
          >
        </div>

        <!-- Cosmical Email -->
        <div>
          <label class="block text-white mb-2">Cosmical Email</label>
          <input
            type="email"
            v-model="cosmicalEmail"
            class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2"
            placeholder="your.name@cosmical.space"
          >
        </div>
      </div>
    </section>

    <!-- Space Preview -->
    <section class="mb-10">
      <h3 class="text-xl font-semibold text-white mb-4">Space Preview</h3>
      
      <div class="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div>
          <p class="text-gray-400">Theme</p>
          <p class="text-white">{{ spacePreview.theme }}</p>
        </div>
        <div>
          <p class="text-gray-400">Template</p>
          <p class="text-white">{{ spacePreview.template }}</p>
        </div>
        <div>
          <p class="text-gray-400">Visibility</p>
          <p class="text-white capitalize">{{ spacePreview.visibility }}</p>
        </div>
        <div>
          <p class="text-gray-400">Size</p>
          <p class="text-white capitalize">{{ spacePreview.size }}</p>
        </div>
      </div>
    </section>

    <!-- Recovery Phrase -->
    <section class="mb-10">
      <h3 class="text-xl font-semibold text-white mb-4">Recovery Phrase</h3>
      
      <div class="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <label class="text-white">Your Recovery Phrase</label>
            <button
              @click="showRecoveryPhrase = !showRecoveryPhrase"
              class="text-sm text-blue-400 hover:text-blue-300"
            >
              {{ showRecoveryPhrase ? 'Hide' : 'Show' }}
            </button>
          </div>
          
          <div
            v-if="showRecoveryPhrase"
            class="p-4 bg-gray-900 rounded border border-gray-700 font-mono text-lg text-blue-300 break-words"
          >
            {{ recoveryPhrase }}
          </div>
          <div
            v-else
            class="p-4 bg-gray-900 rounded border border-gray-700 font-mono text-lg"
          >
            ••• ••• ••• •••
          </div>
        </div>

        <p class="text-yellow-200 text-sm">
          Warning: Store this phrase securely. It's the only way to recover your CSMCL.ID if you lose access.
        </p>
      </div>
    </section>

    <!-- Confirmation -->
    <section class="mb-10">
      <label class="flex items-start space-x-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="confirmationChecked"
          class="mt-1 form-checkbox"
        >
        <span class="text-gray-300">
          I understand that this will permanently establish my CSMCL.ID and space characteristics.
          I have safely stored my recovery phrase and understand it cannot be recovered if lost.
        </span>
      </label>
    </section>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4">
      <button
        class="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        @click="$router.back()"
      >
        Back
      </button>
      <button
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        :disabled="!isValid"
        :class="{ 'opacity-50 cursor-not-allowed': !isValid }"
        @click="confirmCsmclId"
      >
        Confirm & Continue
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-checkbox {
  @apply rounded border-gray-700 text-blue-600 focus:ring-blue-500 bg-gray-800;
}

input[type="text"],
input[type="email"] {
  @apply focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50;
}

/* Animated show/hide transition for recovery phrase */
.recovery-phrase-enter-active,
.recovery-phrase-leave-active {
  @apply transition-all duration-200;
}

.recovery-phrase-enter-from,
.recovery-phrase-leave-to {
  @apply opacity-0 transform -translate-y-2;
}
</style>
