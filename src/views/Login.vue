<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import CryptoJS from 'crypto-js'

const router = useRouter()
const userStore = useUserStore()

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const form = ref({
  cosmicalName: '',
  phrase: '',
  challengeResponse: '',
  displayName: '',
  email: ''
})

const errors = ref({
  cosmicalName: '',
  phrase: '',
  challengeResponse: '',
  displayName: '',
  email: ''
})

const isLoading = ref(false)
const serverError = ref('')
const remainingAttempts = ref(5)
const isBlocked = ref(false)
const blockExpiry = ref(null)
const challenge = ref('')
const isRegistering = ref(false)

const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000
const CHALLENGE_LENGTH = 6

const generateChallenge = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < CHALLENGE_LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const refreshChallenge = () => {
  challenge.value = generateChallenge()
  form.value.challengeResponse = ''
}

const checkBlockStatus = () => false

const resetBlock = () => {
  if (blockExpiry.value && new Date() >= new Date(blockExpiry.value)) {
    isBlocked.value = false
    remainingAttempts.value = MAX_ATTEMPTS
    blockExpiry.value = null
    serverError.value = ''
  }
}

const handleFailedAttempt = () => {}

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

const validateForm = () => true

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  serverError.value = ''
  form.value = {
    cosmicalName: '',
    phrase: '',
    challengeResponse: '',
    displayName: '',
    email: ''
  }
}

const handleSubmit = async () => {
  if (!form.value.cosmicalName) {
    serverError.value = 'Please enter your Cosmical name'
    return
  }

  if (isRegistering.value) {
    if (!form.value.displayName) {
      serverError.value = 'Please enter your display name'
      return
    }
    if (!form.value.email) {
      serverError.value = 'Please enter your email'
      return
    }
  }

  isLoading.value = true
  serverError.value = ''

  try {
    let success
    if (isRegistering.value) {
      success = await userStore.register(form.value)
    } else {
      success = await userStore.login({
        cosmicalName: form.value.cosmicalName,
        phrase: form.value.phrase || 'temp-disabled'
      })
    }

    if (success) {
      router.push('/profile')
    } else {
      serverError.value = isRegistering.value 
        ? 'Registration failed. Please try again.' 
        : 'Login failed. Please try again.'
    }
  } catch (error) {
    console.error('Auth error:', error)
    serverError.value = error.message || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleExplorerLogin = async () => {
  try {
    const success = await userStore.loginAsExplorer()
    if (success) {
      router.push('/explorer')
    } else {
      serverError.value = 'Explorer login failed. Please try again.'
    }
  } catch (error) {
    console.error('Explorer login error:', error)
    serverError.value = 'An error occurred. Please try again.'
  }
}

onMounted(() => {
  challenge.value = generateChallenge()
  resetBlock()
  // Check for expired explorer session
  if (userStore.isExplorerExpired) {
    serverError.value = `Explorer session expired on ${formatDate(userStore.explorerExpiry)}. Please log in again.`
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white">{{ isRegistering ? 'Create Account' : 'Welcome Back' }}</h2>
        <p class="mt-2 text-gray-400">
          {{ isRegistering ? 'Create a new CSMCL.ID account' : 'Sign in to your CSMCL.ID account' }}
        </p>
      </div>

      <div class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Server Error -->
          <div 
            v-if="serverError"
            class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            {{ serverError }}
          </div>

          <!-- Cosmical Name -->
          <div>
            <label for="cosmicalName" class="block text-sm font-medium text-gray-300">
              Cosmical Name
            </label>
            <input
              id="cosmicalName"
              v-model="form.cosmicalName"
              type="text"
              required
              class="mt-1 block w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your Cosmical name"
            />
          </div>

          <!-- Display Name (for registration) -->
          <div v-if="isRegistering">
            <label for="displayName" class="block text-sm font-medium text-gray-300">
              Display Name
            </label>
            <input
              id="displayName"
              v-model="form.displayName"
              type="text"
              required
              class="mt-1 block w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>

          <!-- Email (for registration) -->
          <div v-if="isRegistering">
            <label for="email" class="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2
                     focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white 
                     rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
            >
              <span v-if="isLoading">
                {{ isRegistering ? 'Creating Account...' : 'Signing in...' }}
              </span>
              <span v-else>
                {{ isRegistering ? 'Create Account' : 'Sign In' }}
              </span>
            </button>
          </div>

          <!-- Toggle Register/Login -->
          <div class="text-center">
            <button
              type="button"
              class="text-blue-400 hover:text-blue-300 text-sm"
              @click="toggleMode"
            >
              {{ isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register' }}
            </button>
          </div>
        </form>

        <!-- Explorer Mode -->
        <div class="mt-6">
          <button
            type="button"
            @click="handleExplorerLogin"
            class="w-full flex justify-center py-3 px-4 border border-blue-500/30 rounded-lg shadow-sm text-sm font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Start Exploring
          </button>
        </div>
      </div>

      <div class="text-center text-sm text-gray-400">
        <p>Need help? Check out our <a href="/documentation" class="text-blue-400 hover:text-blue-300">documentation</a>.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
