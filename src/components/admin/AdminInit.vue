&lt;template&gt;
  &lt;div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"&gt;
    &lt;div class="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl"&gt;
      &lt;div&gt;
        &lt;h2 class="mt-6 text-center text-3xl font-extrabold text-white"&gt;
          Initialize Admin Account
        &lt;/h2&gt;
        &lt;p class="mt-2 text-center text-sm text-gray-400"&gt;
          Set up your admin credentials and verify your contact information
        &lt;/p&gt;
      &lt;/div&gt;

      &lt;form class="mt-8 space-y-6" @submit.prevent="handleSubmit"&gt;
        &lt;div class="space-y-4"&gt;
          &lt;!-- Email Verification --&gt;
          &lt;div&gt;
            &lt;label for="verifyEmail" class="block text-sm font-medium text-gray-300"&gt;
              Email Address
            &lt;/label&gt;
            &lt;div class="mt-1 flex space-x-2"&gt;
              &lt;input
                v-model="form.verifyEmail"
                id="verifyEmail"
                type="email"
                required
                class="appearance-none block flex-1 px-3 py-2 border border-gray-700 rounded-md 
                       bg-gray-700/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
                placeholder="Enter your email"
              /&gt;
              &lt;button
                type="button"
                @click="sendEmailVerification"
                :disabled="!form.verifyEmail || loading"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                       rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              &gt;
                Verify
              &lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;!-- SIM Number Verification --&gt;
          &lt;div&gt;
            &lt;label for="simNumber" class="block text-sm font-medium text-gray-300"&gt;
              Phone Number
            &lt;/label&gt;
            &lt;div class="mt-1 flex space-x-2"&gt;
              &lt;input
                v-model="form.simNumber"
                id="simNumber"
                type="tel"
                required
                class="appearance-none block flex-1 px-3 py-2 border border-gray-700 rounded-md 
                       bg-gray-700/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
                placeholder="+27123456789"
              /&gt;
              &lt;button
                type="button"
                @click="sendSimVerification"
                :disabled="!form.simNumber || loading"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                       rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              &gt;
                Verify
              &lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;!-- Recovery Phrase --&gt;
          &lt;div&gt;
            &lt;label for="phrase" class="block text-sm font-medium text-gray-300"&gt;
              Recovery Phrase
            &lt;/label&gt;
            &lt;div class="mt-1"&gt;
              &lt;textarea
                v-model="phrase"
                id="phrase"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md 
                       bg-gray-700/50 placeholder-gray-500 text-white focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
                placeholder="Enter your recovery phrase"
              /&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;!-- KYC Verification --&gt;
          &lt;div class="space-y-4"&gt;
            &lt;div class="flex items-center justify-between"&gt;
              &lt;label class="block text-sm font-medium text-gray-300"&gt;
                KYC Verification
              &lt;/label&gt;
              &lt;button
                type="button"
                @click="startKYCVerification"
                :disabled="loading || form.kycVerified"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium 
                       rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              &gt;
                {{ form.kycVerified ? 'Verified' : 'Start Verification' }}
              &lt;/button&gt;
            &lt;/div&gt;

            &lt;div v-if="form.kycStatus" class="bg-gray-700/30 rounded-lg p-4 space-y-2"&gt;
              &lt;div class="flex items-center justify-between text-sm"&gt;
                &lt;span class="text-gray-400"&gt;Status&lt;/span&gt;
                &lt;span :class="{
                  'text-yellow-400': form.kycStatus === 'pending',
                  'text-green-400': form.kycStatus === 'approved',
                  'text-red-400': form.kycStatus === 'rejected'
                }"&gt;
                  {{ form.kycStatus.charAt(0).toUpperCase() + form.kycStatus.slice(1) }}
                &lt;/span&gt;
              &lt;/div&gt;
              &lt;div class="flex items-center justify-between text-sm"&gt;
                &lt;span class="text-gray-400"&gt;Level&lt;/span&gt;
                &lt;span class="text-purple-400"&gt;{{ form.kycLevel || 'None' }}&lt;/span&gt;
              &lt;/div&gt;
              &lt;div v-if="form.kycDocuments.length > 0" class="text-sm"&gt;
                &lt;span class="text-gray-400"&gt;Verified Documents:&lt;/span&gt;
                &lt;ul class="mt-1 space-y-1"&gt;
                  &lt;li v-for="doc in form.kycDocuments" :key="doc" class="text-purple-400"&gt;
                    • {{ doc.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  &lt;/li&gt;
                &lt;/ul&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;!-- Verification Status --&gt;
          &lt;div class="space-y-2"&gt;
            &lt;div class="flex items-center space-x-2 text-sm"&gt;
              &lt;span class="text-gray-400"&gt;Email Verification:&lt;/span&gt;
              &lt;span :class="form.emailVerified ? 'text-green-400' : 'text-yellow-400'"&gt;
                {{ form.emailVerified ? 'Verified' : 'Pending' }}
              &lt;/span&gt;
            &lt;/div&gt;
            &lt;div class="flex items-center space-x-2 text-sm"&gt;
              &lt;span class="text-gray-400"&gt;SIM Verification:&lt;/span&gt;
              &lt;span :class="form.simVerified ? 'text-green-400' : 'text-yellow-400'"&gt;
                {{ form.simVerified ? 'Verified' : 'Pending' }}
              &lt;/span&gt;
            &lt;/div&gt;
            &lt;div class="flex items-center space-x-2 text-sm"&gt;
              &lt;span class="text-gray-400"&gt;KYC Status:&lt;/span&gt;
              &lt;span :class="{
                'text-yellow-400': form.kycStatus === 'pending',
                'text-green-400': form.kycStatus === 'approved',
                'text-red-400': form.kycStatus === 'rejected'
              }"&gt;
                {{ form.kycStatus ? (form.kycStatus.charAt(0).toUpperCase() + form.kycStatus.slice(1)) : 'Not Started' }}
              &lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;div v-if="error" class="text-red-400 text-sm text-center"&gt;
          {{ error }}
        &lt;/div&gt;

        &lt;div&gt;
          &lt;button
            type="submit"
            :disabled="!isValid || loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                   shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                   disabled:opacity-50 disabled:cursor-not-allowed"
          &gt;
            {{ loading ? 'Initializing...' : 'Initialize Admin' }}
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/form&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { userDb } from '../../services/userDb'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  verifyEmail: '',
  simNumber: '',
  emailVerified: false,
  simVerified: false,
  kycStatus: '',
  kycLevel: '',
  kycVerified: false,
  kycDocuments: []
})

const phrase = ref('')
const error = ref('')
const loading = ref(false)
const phraseStrength = ref(0)

// Generate a new recovery phrase
const generatePhrase = () => {
  phrase.value = userDb.getRecoveryPhrase()
  error.value = ''
  // Calculate phrase strength
  phraseStrength.value = userDb.getPhraseStrength(phrase.value)
}

// Send email verification code
const sendEmailVerification = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // TODO: Implement actual email verification
    // For demo, just mark as verified
    form.value.emailVerified = true
    
  } catch (err) {
    console.error('Email verification error:', err)
    error.value = 'Failed to send email verification'
  } finally {
    loading.value = false
  }
}

// Send SIM verification code
const sendSimVerification = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // TODO: Implement actual SIM verification
    // For demo, just mark as verified
    form.value.simVerified = true
    
  } catch (err) {
    console.error('SIM verification error:', err)
    error.value = 'Failed to send SIM verification'
  } finally {
    loading.value = false
  }
}

// Start KYC verification process
const startKYCVerification = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // TODO: Implement actual KYC verification flow
    // For demo, simulate document verification
    const documents = ['id_verified', 'proof_of_address']
    
    // Update KYC status
    form.value.kycStatus = 'approved'
    form.value.kycLevel = 'basic'
    form.value.kycVerified = true
    form.value.kycDocuments = documents
    
  } catch (err) {
    console.error('KYC verification error:', err)
    error.value = 'Failed to complete KYC verification'
  } finally {
    loading.value = false
  }
}

// Handle form submission
const handleSubmit = async () => {
  try {
    error.value = ''
    loading.value = true

    // Validate all required verifications
    if (!form.value.emailVerified || !form.value.simVerified || !form.value.kycVerified) {
      error.value = 'Please complete all verifications'
      return
    }

    // Validate phrase
    if (!userDb.validatePhrase(phrase.value)) {
      error.value = 'Invalid recovery phrase format'
      return
    }

    // Get admin user
    const adminUser = userDb.getUser('CSMCL_ADMIN')
    if (!adminUser) {
      error.value = 'Admin user not found'
      return
    }

    // Generate salt for encryption
    const salt = crypto.getRandomValues(new Uint8Array(16)).join('')
    
    // Update admin with new credentials
    await userDb.updateUser('CSMCL_ADMIN', {
      verifyEmail: form.value.verifyEmail,
      simNumber: form.value.simNumber,
      phrase: userDb.encryptData(phrase.value, salt),
      salt,
      isVerified: true,
      emailVerified: true,
      simVerified: true,
      kycCompliance: {
        status: form.value.kycStatus,
        level: form.value.kycLevel,
        documents: form.value.kycDocuments,
        lastChecked: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year expiry
      },
      requiresInit: false
    })

    // Log in as admin
    const success = await userStore.login({
      cosmicalName: 'CSMCL_ADMIN',
      phrase: phrase.value
    })

    if (success) {
      router.push('/admin')
    } else {
      error.value = 'Failed to initialize admin account'
    }
  } catch (err) {
    console.error('Admin initialization error:', err)
    error.value = 'An error occurred during initialization'
  } finally {
    loading.value = false
  }
}

const isValid = computed(() => {
  if (!form.value.verifyEmail || !form.value.simNumber || !phrase.value) return false
  if (!form.value.emailVerified || !form.value.simVerified || !form.value.kycVerified) return false
  if (phraseStrength.value < 80) return false
  return true
})
&lt;/script&gt;
