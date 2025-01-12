<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { userDb } from '../services/userDb'
import CryptoJS from 'crypto-js'
import { wordlist } from '@scure/bip39/wordlists/english'

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
  email: '',
  password: ''
})

const errors = ref({
  cosmicalName: '',
  phrase: '',
  challengeResponse: '',
  displayName: '',
  email: '',
  password: ''
})

const phraseStrength = ref(0)
const suggestedPhrase = ref('')
const showPassword = ref(false)
const suggestedPassword = ref('')
const passwordStrength = ref(0)
const passwordIssues = ref([])

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

const getPhraseStrength = (phrase) => {
  if (!phrase) return 0
  return userDb.getPhraseStrength(phrase)
}

const getStrengthColor = (strength) => {
  return strength === 100 ? 'bg-green-500' : 'bg-red-500'
}

const getStrengthLabel = (strength) => {
  return strength === 100 ? 'Valid Recovery Phrase' : 'Invalid Recovery Phrase'
}

const generateRecoveryPhrase = () => {
  try {
    suggestedPhrase.value = userDb.getRecoveryPhrase()
    updatePhraseStrength()
  } catch (error) {
    console.error('Failed to generate recovery phrase:', error)
  }
}

const usePhraseSuggestion = () => {
  form.value.phrase = suggestedPhrase.value
  updatePhraseStrength()
}

const updatePhraseStrength = () => {
  // For BIP39 phrases, strength is binary - either valid or invalid
  const isValid = validatePhrase(form.value.phrase)
  phraseStrength.value = isValid ? 100 : 0
}

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
  if (!word) return false
  return wordlist.includes(word.toLowerCase().trim())
}

const validatePhrase = (phrase) => {
  if (!phrase) return false
  return userDb.validateFlowPhrase(phrase.trim())
}

const hashPhrase = (phrase, salt) => {
  if (!phrase) return ''
  // Get Flow-compatible seed for proof of ownership
  const seed = userDb.getFlowSeed(phrase.trim())
  return CryptoJS.SHA3(seed + salt).toString()
}

const handleSubmit = async () => {
  errors.value = {} // Reset errors
  serverError.value = '' // Reset server error
  
  // Basic validation
  if (!form.value.cosmicalName) {
    errors.value.cosmicalName = 'Please enter your Cosmical name'
    return
  }

  // Skip phrase validation for admin/explorer
  const isAdminOrExplorer = form.value.cosmicalName.toUpperCase() === 'CSMCL ADMIN' || 
                           form.value.cosmicalName.toUpperCase() === 'CSMCL EXPLORER'
  
  if (!isAdminOrExplorer && !form.value.phrase) {
    errors.value.phrase = 'Please enter your recovery phrase'
    return
  }

  isLoading.value = true

  try {
    // Login with skipPhraseValidation for admin/explorer
    const success = await userStore.login({
      cosmicalName: form.value.cosmicalName,
      phrase: form.value.phrase,
      skipPhraseValidation: isAdminOrExplorer
    })

    if (success) {
      router.push('/profile')
    } else {
      serverError.value = 'Invalid credentials. Please try again.'
    }
  } catch (error) {
    console.error('Auth error:', error)
    serverError.value = error.message || 'An error occurred'
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

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const generatePassword = () => {
  try {
    suggestedPassword.value = userDb.getSecurePassword()
  } catch (error) {
    console.error('Failed to generate password:', error)
  }
}

const usePasswordSuggestion = () => {
  form.value.password = suggestedPassword.value
  updatePasswordStrength()
}

const updatePasswordStrength = () => {
  const validation = userDb.validatePassword(form.value.password)
  passwordStrength.value = validation.score
  
  // Update password requirements
  passwordIssues.value = [
    { text: 'At least 16 characters long', met: form.value.password.length >= 16 },
    { text: 'Contains uppercase letters', met: /[A-Z]/.test(form.value.password) },
    { text: 'Contains lowercase letters', met: /[a-z]/.test(form.value.password) },
    { text: 'Contains numbers', met: /[0-9]/.test(form.value.password) },
    { text: 'Contains special characters', met: /[^A-Za-z0-9]/.test(form.value.password) }
  ]
}

const getPasswordStrengthColor = (strength) => {
  if (strength >= 80) return 'bg-green-500'
  if (strength >= 60) return 'bg-yellow-500'
  if (strength >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

const getPasswordStrengthLabel = (strength) => {
  if (strength >= 80) return 'Strong'
  if (strength >= 60) return 'Good'
  if (strength >= 40) return 'Fair'
  return 'Weak'
}

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  serverError.value = ''
  errors.value = {}
  form.value = {
    cosmicalName: '',
    phrase: '',
    challengeResponse: '',
    displayName: '',
    email: '',
    password: ''
  }
  suggestedPhrase.value = ''
  suggestedPassword.value = ''
  phraseStrength.value = 0
  passwordStrength.value = 0
  showPassword.value = false
}

watch(() => form.value.phrase, (newPhrase) => {
  updatePhraseStrength()
})

watch(() => form.value.password, (newPassword) => {
  if (newPassword) {
    updatePasswordStrength()
  } else {
    passwordStrength.value = 0
    passwordIssues.value = []
  }
})

onMounted(() => {
  challenge.value = generateChallenge()
  resetBlock()
  generateRecoveryPhrase()
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
        <h2 class="text-3xl font-bold text-white">Welcome Back</h2>
        <p class="mt-2 text-gray-400">
          Sign in to your CSMCL.ID account
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

          <!-- Username -->
          <div>
            <label for="cosmicalName" class="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div class="mt-1">
              <input
                id="cosmicalName"
                v-model="form.cosmicalName"
                type="text"
                required
                placeholder="Enter your username"
                class="appearance-none block w-full px-3 py-2 border border-gray-700/50 rounded-lg
                       bg-gray-800/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500/50 focus:border-transparent"
                :class="{ 'border-red-500/50': errors.cosmicalName }"
              />
            </div>
            <p v-if="errors.cosmicalName" class="mt-2 text-sm text-red-400">{{ errors.cosmicalName }}</p>
            <p class="mt-1 text-xs text-gray-400">
              <span class="inline-block">Admin: CSMCL ADMIN</span>
            </p>
          </div>

          <!-- Recovery Phrase -->
          <div>
            <label for="phrase" class="block text-sm font-medium text-gray-300">
              Recovery Phrase
            </label>
            <div class="mt-1">
              <input
                id="phrase"
                v-model="form.phrase"
                type="text"
                required
                placeholder="Enter your recovery phrase"
                class="appearance-none block w-full px-3 py-2 border border-gray-700/50 rounded-lg
                       bg-gray-800/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500/50 focus:border-transparent"
                :class="{ 'border-red-500/50': errors.phrase }"
              />
            </div>
            <p v-if="errors.phrase" class="mt-2 text-sm text-red-400">{{ errors.phrase }}</p>
            <div class="mt-1 text-[11px] leading-tight text-gray-400 break-normal">
              <div class="border border-gray-700/50 rounded-lg p-2 bg-gray-800/30 backdrop-blur-sm">
                <div class="grid grid-cols-1 gap-1">
                  <div>Admin: <span class="font-mono whitespace-normal">abandon ability able about above absent absorb abstract absurd abuse access accident</span></div>
                  <div class="border-t border-gray-700/30 my-1"></div>
                  <div>Explorer: <span class="font-mono whitespace-normal">zebra youth yellow worth window wish winter width wild west wave vault</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg
                     shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span v-if="isLoading">Loading...</span>
              <span v-else>Sign In</span>
            </button>
          </div>
        </form>

        <!-- Explorer Mode -->
        <div class="mt-6">
          <button
            @click="handleExplorerLogin"
            class="w-full flex justify-center py-2 px-4 border border-gray-700/50 rounded-lg
                   shadow-sm text-sm font-medium text-gray-300 bg-gray-800/30 hover:bg-gray-700/30
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Enter Explorer Mode
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
