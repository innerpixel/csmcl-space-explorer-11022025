<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, debounce } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import CryptoJS from 'crypto-js'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  displayName: '',
  cosmicalEmail: '',
  recoveryPhrase: '',
  challengeResponse: '',
  agreeToTerms: false
})

const formState = ref({
  isLoading: false,
  isSaving: false,
  hasChanges: false,
  lastSaved: null
})

const originalForm = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalForm.value) return false
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
})

watch(form, () => {
  formState.value.hasChanges = hasUnsavedChanges.value
}, { deep: true })

watch(() => userStore.user, (newUser) => {
  if (newUser) {
    const newForm = {
      displayName: newUser.displayName || '',
      cosmicalEmail: newUser.email ? newUser.email.split('@')[0] : '',
      recoveryPhrase: '', // Don't populate for security
      challengeResponse: '',
      agreeToTerms: true
    }
    form.value = newForm
    originalForm.value = { ...newForm }
    formState.value.hasChanges = false
  }
}, { immediate: true })

const errors = ref({
  displayName: '',
  cosmicalEmail: '',
  recoveryPhrase: '',
  challengeResponse: '',
  agreeToTerms: ''
})

const isLoading = ref(false)
const serverError = ref('')
const remainingAttempts = ref(5)
const isBlocked = ref(false)
const blockExpiry = ref(null)
const challenge = ref('')

const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000 // 15 minutes
const CHALLENGE_LENGTH = 6

const generateChallenge = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < CHALLENGE_LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const checkBlockStatus = () => {
  if (blockExpiry.value && new Date() < new Date(blockExpiry.value)) {
    isBlocked.value = true
    const timeLeft = Math.ceil((new Date(blockExpiry.value) - new Date()) / 1000 / 60)
    serverError.value = `Too many attempts. Please try again in ${timeLeft} minutes.`
    return true
  }
  isBlocked.value = false
  return false
}

const resetBlock = () => {
  if (blockExpiry.value && new Date() >= new Date(blockExpiry.value)) {
    isBlocked.value = false
    remainingAttempts.value = MAX_ATTEMPTS
    blockExpiry.value = null
    serverError.value = ''
  }
}

const handleFailedAttempt = () => {
  remainingAttempts.value--
  if (remainingAttempts.value <= 0) {
    blockExpiry.value = new Date(Date.now() + BLOCK_DURATION)
    isBlocked.value = true
    serverError.value = 'Too many attempts. Please try again in 15 minutes.'
  } else {
    serverError.value = `Registration failed. ${remainingAttempts.value} attempts remaining.`
  }
}

const validateWord = (word) => {
  return word.length >= 3 && /^[a-zA-Z]+$/.test(word)
}

const validatePhrase = (phrase) => {
  const words = phrase.trim().split(/\s+/)
  return words.length >= 2 && words.every(validateWord)
}

const hashPhrase = (phrase, salt) => {
  const combinedPhrase = `${phrase}${salt}${form.value.challengeResponse}`
  return CryptoJS.SHA3(combinedPhrase).toString()
}

const validateForm = () => {
  let isValid = true
  errors.value = {
    displayName: '',
    cosmicalEmail: '',
    recoveryPhrase: '',
    challengeResponse: '',
    agreeToTerms: ''
  }

  // Display name validation
  if (!form.value.displayName) {
    errors.value.displayName = 'Display name is required'
    isValid = false
  } else if (form.value.displayName.length < 2) {
    errors.value.displayName = 'Display name must be at least 2 characters'
    isValid = false
  }

  // Email validation
  if (!form.value.cosmicalEmail) {
    errors.value.cosmicalEmail = 'Email is required'
    isValid = false
  } else if (!/^[a-zA-Z0-9_-]+$/.test(form.value.cosmicalEmail)) {
    errors.value.cosmicalEmail = 'Email can only contain letters, numbers, underscores, and hyphens'
    isValid = false
  }

  // Recovery phrase validation if provided
  if (form.value.recoveryPhrase && !validatePhrase(form.value.recoveryPhrase)) {
    errors.value.recoveryPhrase = 'Invalid recovery phrase format'
    isValid = false
  }

  // Challenge response validation
  if (!form.value.challengeResponse) {
    errors.value.challengeResponse = 'Please complete the challenge'
    isValid = false
  } else if (form.value.challengeResponse !== challenge.value) {
    errors.value.challengeResponse = 'Incorrect challenge response'
    isValid = false
  }

  return isValid
}

const autoSave = debounce(async () => {
  if (!hasUnsavedChanges.value) return
  
  try {
    formState.value.isSaving = true
    await userStore.updateUserProfile({
      displayName: form.value.displayName,
      email: `${form.value.cosmicalEmail}@csmcl.space`
    })
    formState.value.lastSaved = new Date()
    originalForm.value = { ...form.value }
  } catch (error) {
    console.error('Auto-save failed:', error)
  } finally {
    formState.value.isSaving = false
  }
}, 2000)

watch([() => form.value.displayName, () => form.value.cosmicalEmail], autoSave)

const handleSubmit = async () => {
  if (checkBlockStatus()) return
  if (!validateForm()) return

  formState.value.isLoading = true
  serverError.value = ''

  try {
    // Save any pending changes
    if (hasUnsavedChanges.value) {
      await userStore.updateUserProfile({
        displayName: form.value.displayName,
        email: `${form.value.cosmicalEmail}@csmcl.space`
      })
    }

    // Move to next step
    router.push('/onboarding/verify')
  } catch (error) {
    console.error('Submission failed:', error)
    handleFailedAttempt()
  } finally {
    formState.value.isLoading = false
  }
}

onMounted(async () => {
  challenge.value = generateChallenge()
  resetBlock()
  
  // Load saved form data from localStorage
  const savedForm = localStorage.getItem('onboarding_identity_form')
  if (savedForm) {
    try {
      const parsed = JSON.parse(savedForm)
      form.value = {
        ...form.value,
        ...parsed
      }
    } catch (error) {
      console.error('Failed to load saved form:', error)
    }
  }
  
  // If user exists in store, populate form
  if (userStore.user) {
    const newForm = {
      displayName: userStore.user.displayName || '',
      cosmicalEmail: userStore.user.email ? userStore.user.email.split('@')[0] : '',
      recoveryPhrase: '', // Don't populate for security
      challengeResponse: '',
      agreeToTerms: true
    }
    form.value = newForm
    originalForm.value = { ...newForm }
  }
})

onBeforeUnmount(() => {
  const formData = {
    displayName: form.value.displayName,
    cosmicalEmail: form.value.cosmicalEmail,
    agreeToTerms: form.value.agreeToTerms
  }
  localStorage.setItem('onboarding_identity_form', JSON.stringify(formData))
})

defineExpose({
  form,
  errors,
  handleSubmit
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl mx-auto w-full">
    <div 
      v-if="serverError"
      class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm space-y-2"
    >
      <div class="flex items-start">
        <svg class="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-medium">{{ serverError }}</p>
          <p v-if="remainingAttempts < MAX_ATTEMPTS" class="text-sm text-red-500/80 mt-1">
            {{ remainingAttempts }} attempts remaining before temporary lockout
          </p>
        </div>
      </div>
    </div>

    <!-- Display Name -->
    <div>
      <label for="displayName" class="block text-sm font-medium text-gray-300">
        Display Name
      </label>
      <div class="mt-1 relative">
        <input
          id="displayName"
          v-model="form.displayName"
          type="text"
          required
          :disabled="isBlocked"
          autocomplete="off"
          placeholder="Enter at least two words (e.g., Cosmic Explorer)"
          class="block w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50
                 text-white placeholder-gray-500 focus:outline-none focus:ring-2
                 focus:ring-blue-500/50 focus:border-transparent"
          :class="{ 'border-red-500/50': errors.displayName }"
        />
        <div
          v-if="errors.displayName"
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      <p v-if="errors.displayName" class="mt-2 text-sm text-red-400">
        {{ errors.displayName }}
      </p>
      <p v-else class="mt-2 text-sm text-gray-500">
        This is how you'll be known in the CSMCL ecosystem
      </p>
    </div>

    <!-- Cosmical Email -->
    <div>
      <label for="cosmicalEmail" class="block text-sm font-medium text-gray-300">
        Cosmical Email
      </label>
      <div class="mt-1 relative">
        <div class="flex rounded-lg overflow-hidden">
          <input
            id="cosmicalEmail"
            v-model="form.cosmicalEmail"
            type="text"
            required
            :disabled="isBlocked"
            autocomplete="off"
            placeholder="your.name"
            class="block flex-1 min-w-0 px-4 py-3 bg-gray-900/50 border border-r-0 border-gray-700/50
                   text-white placeholder-gray-500 focus:outline-none focus:ring-2
                   focus:ring-blue-500/50 focus:border-transparent rounded-l-lg"
            :class="{ 'border-red-500/50': errors.cosmicalEmail }"
          />
          <span 
            class="inline-flex items-center px-4 py-3 border border-l-0 border-gray-700/50 
                   bg-gray-800/50 text-gray-400 font-mono whitespace-nowrap"
          >
            @csmcl.space
          </span>
        </div>
        <div
          v-if="errors.cosmicalEmail"
          class="absolute inset-y-0 right-12 pr-3 flex items-center pointer-events-none"
        >
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      <p v-if="errors.cosmicalEmail" class="mt-2 text-sm text-red-400">
        {{ errors.cosmicalEmail }}
      </p>
      <p v-else class="mt-2 text-sm text-gray-500">
        Your unique email in the CSMCL ecosystem
      </p>
    </div>

    <!-- Recovery Phrase -->
    <div>
      <label for="recoveryPhrase" class="block text-sm font-medium text-gray-300">
        Recovery Phrase
      </label>
      <div class="mt-1 relative">
        <input
          id="recoveryPhrase"
          v-model="form.recoveryPhrase"
          type="text"
          required
          :disabled="isBlocked"
          autocomplete="off"
          placeholder="Enter memorable words (e.g., Purple Mountain Majesty)"
          class="block w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50
                 text-white placeholder-gray-500 focus:outline-none focus:ring-2
                 focus:ring-blue-500/50 focus:border-transparent"
          :class="{ 'border-red-500/50': errors.recoveryPhrase }"
        />
        <div
          v-if="errors.recoveryPhrase"
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      <p v-if="errors.recoveryPhrase" class="mt-2 text-sm text-red-400">
        {{ errors.recoveryPhrase }}
      </p>
      <p v-else class="mt-2 text-sm text-gray-500">
        Use memorable words to help recover your account
      </p>
    </div>

    <!-- Challenge Code -->
    <div>
      <label for="challengeResponse" class="block text-sm font-medium text-gray-300">
        Security Check
      </label>
      <div class="mt-1 relative">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input
              id="challengeResponse"
              v-model="form.challengeResponse"
              type="text"
              required
              :disabled="isBlocked"
              autocomplete="off"
              placeholder="Enter the code shown"
              class="block w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2
                     focus:ring-blue-500/50 focus:border-transparent uppercase"
              :class="{ 'border-red-500/50': errors.challengeResponse }"
            />
          </div>
          <div 
            class="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-lg font-mono
                   text-gray-300 select-none"
          >
            {{ challenge }}
          </div>
        </div>
        <div
          v-if="errors.challengeResponse"
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      <p v-if="errors.challengeResponse" class="mt-2 text-sm text-red-400">
        {{ errors.challengeResponse }}
      </p>
      <p v-else class="mt-2 text-sm text-gray-500">
        Enter the code exactly as shown
      </p>
    </div>

    <!-- Terms and Conditions -->
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          id="terms"
          v-model="form.agreeToTerms"
          type="checkbox"
          :disabled="isBlocked"
          class="h-4 w-4 rounded border-gray-700/50 bg-gray-900/50 text-blue-500
                 focus:ring-blue-500/50 focus:ring-offset-0"
        />
      </div>
      <div class="ml-3">
        <label for="terms" class="text-sm text-gray-300">
          I agree to the
          <a href="#" class="text-blue-400 hover:text-blue-300">Terms of Service</a>
          and
          <a href="#" class="text-blue-400 hover:text-blue-300">Privacy Policy</a>
        </label>
        <p v-if="errors.agreeToTerms" class="mt-1 text-sm text-red-400">
          {{ errors.agreeToTerms }}
        </p>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="isBlocked || isLoading"
      class="w-full px-4 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg
             hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50
             transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <template v-if="isLoading">
        Creating Identity...
      </template>
      <template v-else>
        Create Identity
      </template>
    </button>
  </form>
</template>
