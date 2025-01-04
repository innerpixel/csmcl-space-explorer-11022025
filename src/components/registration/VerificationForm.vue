<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  verificationCode: ''
})

const errors = ref({
  verificationCode: ''
})

const validateForm = () => {
  let isValid = true
  errors.value = {
    verificationCode: ''
  }

  if (!form.value.verificationCode) {
    errors.value.verificationCode = 'Verification code is required'
    isValid = false
  } else if (!/^\d{6}$/.test(form.value.verificationCode)) {
    errors.value.verificationCode = 'Please enter a valid 6-digit code'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    // Here you would typically verify the code with your API
    await userStore.verifyEmail(form.value.verificationCode)
    
    // Redirect to next step or dashboard
    router.push('/login')
  } catch (error) {
    console.error('Verification failed:', error)
    errors.value.verificationCode = 'Invalid verification code'
  }
}

defineExpose({
  form,
  errors,
  handleSubmit
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Verification Code -->
    <div>
      <label for="verificationCode" class="block text-sm font-medium text-gray-300 mb-1">
        Verification Code
      </label>
      <input
        id="verificationCode"
        v-model="form.verificationCode"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="6"
        class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg
               text-white placeholder-gray-500 focus:outline-none focus:ring-2
               focus:ring-blue-500/50 focus:border-transparent tracking-wider text-center
               font-mono text-lg"
        placeholder="000000"
      />
      <p v-if="errors.verificationCode" class="mt-1 text-sm text-red-400">
        {{ errors.verificationCode }}
      </p>
      <p class="mt-2 text-sm text-gray-500">
        Enter the 6-digit verification code sent to your email
      </p>
    </div>

    <!-- Resend Code -->
    <div class="text-center">
      <button
        type="button"
        class="text-sm text-blue-400 hover:text-blue-300 focus:outline-none"
        @click="$emit('resend')"
      >
        Didn't receive the code? Resend
      </button>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg
             hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50
             transition-colors duration-300"
    >
      Verify Email
    </button>
  </form>
</template>
