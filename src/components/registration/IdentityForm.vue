<script setup>
import { ref, computed, onMounted } from 'vue'
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

  // Validate display name
  if (!form.value.displayName) {
    errors.value.displayName = 'Display name is required'
    isValid = false
  } else {
    const words = form.value.displayName.trim().split(/\s+/)
    if (words.length < 2) {
      errors.value.displayName = 'Please enter at least 2 words'
      isValid = false
    } else if (words.some(word => !validateWord(word))) {
      errors.value.displayName = 'Each word must be at least 3 letters and contain only letters'
      isValid = false
    }
  }

  // Validate cosmical email
  if (!form.value.cosmicalEmail) {
    errors.value.cosmicalEmail = 'Email is required'
    isValid = false
  } else {
    const emailPrefix = form.value.cosmicalEmail.split('@')[0]
    if (!/^[a-z0-9.]+$/.test(emailPrefix)) {
      errors.value.cosmicalEmail = 'Email can only contain lowercase letters, numbers, and dots'
      isValid = false
    } else if (emailPrefix.length < 3) {
      errors.value.cosmicalEmail = 'Email must be at least 3 characters before @csmcl.space'
      isValid = false
    }
  }

  // Validate recovery phrase
  if (!form.value.recoveryPhrase) {
    errors.value.recoveryPhrase = 'Recovery phrase is required'
    isValid = false
  } else if (!validatePhrase(form.value.recoveryPhrase)) {
    errors.value.recoveryPhrase = 'Phrase must contain at least 2 words, each with 3+ letters'
    isValid = false
  }

  // Validate challenge response
  if (!form.value.challengeResponse) {
    errors.value.challengeResponse = 'Please enter the challenge code'
    isValid = false
  } else if (form.value.challengeResponse !== challenge.value) {
    errors.value.challengeResponse = 'Invalid challenge code'
    isValid = false
  }

  // Validate terms agreement
  if (!form.value.agreeToTerms) {
    errors.value.agreeToTerms = 'You must agree to the terms and conditions'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (checkBlockStatus()) return
  if (!validateForm()) return

  isLoading.value = true
  serverError.value = ''

  try {
    const randomDelay = Math.floor(Math.random() * 1000) + 500
    await new Promise(resolve => setTimeout(resolve, randomDelay))

    const hashedPhrase = hashPhrase(form.value.recoveryPhrase, form.value.cosmicalEmail)
    
    await userStore.register({
      displayName: form.value.displayName,
      cosmicalEmail: form.value.cosmicalEmail.toLowerCase() + '@csmcl.space',
      recoveryPhrase: hashedPhrase
    })
    
    router.push('/onboarding/verify')
  } catch (error) {
    console.error('Registration failed:', error)
    if (error.message.includes('name')) {
      errors.value.displayName = error.message
    } else if (error.message.includes('email')) {
      errors.value.cosmicalEmail = error.message
    } else if (error.message.includes('phrase')) {
      errors.value.recoveryPhrase = error.message
    } else {
      handleFailedAttempt()
    }
  } finally {
    isLoading.value = false
    challenge.value = generateChallenge()
  }
}

onMounted(() => {
  challenge.value = generateChallenge()
  resetBlock()
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
      class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
    >
      {{ serverError }}
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
