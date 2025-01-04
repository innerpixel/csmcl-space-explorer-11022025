<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import CryptoJS from 'crypto-js'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  cosmicalName: '',
  phrase: '',
  challengeResponse: ''
})

const errors = ref({
  cosmicalName: '',
  phrase: '',
  challengeResponse: ''
})

const isLoading = ref(false)
const serverError = ref('')
const remainingAttempts = ref(5)
const isBlocked = ref(false)
const blockExpiry = ref(null)
const challenge = ref('')

const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000
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
    serverError.value = `Invalid credentials. ${remainingAttempts.value} attempts remaining.`
  }
}

const validateWord = (word) => {
  return word.length >= 3 && /^[a-zA-Z]+$/.test(word)
}

const validatePhrase = (phrase) => {
  const words = phrase.trim().split(/\s+/)
  return words.length >= 3 && words.every(validateWord)
}

const hashPhrase = (phrase, salt) => {
  const combinedPhrase = `${phrase}${salt}${form.value.challengeResponse}`
  return CryptoJS.SHA3(combinedPhrase).toString()
}

const validateForm = () => {
  errors.value = {
    cosmicalName: '',
    phrase: '',
    challengeResponse: ''
  }
  
  let isValid = true

  if (!form.value.cosmicalName) {
    errors.value.cosmicalName = 'Cosmical name is required'
    isValid = false
  } else if (!/^[a-zA-Z0-9_-]+$/.test(form.value.cosmicalName)) {
    errors.value.cosmicalName = 'Invalid characters in Cosmical name'
    isValid = false
  }

  if (!form.value.phrase) {
    errors.value.phrase = 'Phrase is required'
    isValid = false
  } else if (!validatePhrase(form.value.phrase)) {
    errors.value.phrase = 'Phrase must contain at least 3 words, each with 3+ letters'
    isValid = false
  }

  if (!form.value.challengeResponse) {
    errors.value.challengeResponse = 'Please enter the challenge code'
    isValid = false
  } else if (form.value.challengeResponse !== challenge.value) {
    errors.value.challengeResponse = 'Invalid challenge code'
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

    const hashedPhrase = hashPhrase(form.value.phrase, form.value.cosmicalName)
    
    if (form.value.cosmicalName === 'demo' && validatePhrase(form.value.phrase)) {
      await userStore.login({
        cosmicalName: form.value.cosmicalName,
      })
      router.push('/profile')
    } else {
      handleFailedAttempt()
    }
  } catch (error) {
    serverError.value = 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
    challenge.value = generateChallenge()
  }
}

onMounted(() => {
  challenge.value = generateChallenge()
  resetBlock()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white">Welcome Back</h2>
        <p class="mt-2 text-gray-400">
          Don't have a CSMCL.ID account? 
          <a 
            href="/documentation" 
            class="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Read More
          </a>
        </p>
      </div>

      <div 
        class="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 
               p-8 shadow-xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-all duration-500"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div 
            v-if="serverError"
            class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            {{ serverError }}
          </div>

          <div>
            <label 
              for="cosmicalName" 
              class="block text-sm font-medium text-gray-300"
            >
              Cosmical Name
            </label>
            <div class="mt-1">
              <input
                id="cosmicalName"
                v-model="form.cosmicalName"
                type="text"
                required
                :disabled="isBlocked"
                class="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.cosmicalName }"
                placeholder="Your Cosmical name"
              >
              <p 
                v-if="errors.cosmicalName" 
                class="mt-1 text-sm text-red-400"
              >
                {{ errors.cosmicalName }}
              </p>
            </div>
          </div>

          <div>
            <label 
              for="phrase" 
              class="block text-sm font-medium text-gray-300"
            >
              Recovery Phrase
            </label>
            <div class="mt-1">
              <textarea
                id="phrase"
                v-model="form.phrase"
                required
                :disabled="isBlocked"
                rows="3"
                class="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2
                       focus:ring-blue-500 focus:border-transparent transition-all"
                :class="{ 'border-red-500': errors.phrase }"
                placeholder="Enter your recovery phrase (min 3 words, 3+ letters each)"
              ></textarea>
              <p 
                v-if="errors.phrase" 
                class="mt-1 text-sm text-red-400"
              >
                {{ errors.phrase }}
              </p>
            </div>
          </div>

          <div>
            <label 
              for="challengeResponse" 
              class="block text-sm font-medium text-gray-300"
            >
              Security Check
            </label>
            <div class="mt-1">
              <div class="flex items-center space-x-4">
                <div 
                  class="px-4 py-2 bg-gray-800 rounded-lg border border-gray-600
                         font-mono text-gray-300"
                >
                  {{ challenge }}
                </div>
                <input
                  id="challengeResponse"
                  v-model="form.challengeResponse"
                  type="text"
                  required
                  :disabled="isBlocked"
                  class="flex-1 px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:border-transparent transition-all"
                  :class="{ 'border-red-500': errors.challengeResponse }"
                  placeholder="Enter the code shown"
                >
              </div>
              <p 
                v-if="errors.challengeResponse" 
                class="mt-1 text-sm text-red-400"
              >
                {{ errors.challengeResponse }}
              </p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading || isBlocked"
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white 
                   rounded-lg font-medium transform transition-all duration-300
                   hover:from-blue-500 hover:to-blue-400 hover:scale-[1.02] hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:scale-100"
          >
            <span v-if="isLoading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>

      <div class="text-center text-sm text-gray-400">
        <p>Your phrase should be the one you created during registration.</p>
        <p class="mt-1">
          Forgot your phrase? Contact 
          <a 
            href="mailto:support@csmcl.space" 
            class="text-blue-400 hover:text-blue-300 transition-colors"
          >
            support
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
