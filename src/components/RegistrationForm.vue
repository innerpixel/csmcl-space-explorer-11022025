<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const form = ref({
  displayName: '',
  emailName: '',
  simNumber: '',
  regularEmail: ''
})

const errors = ref({})

const cosmicalEmail = computed(() => {
  return form.value.emailName ? 
    `${form.value.emailName.toLowerCase().replace(/[^a-z0-9]/g, '')}@csmcl.space` : 
    '@csmcl.space'
})

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.displayName) {
    errors.value.displayName = 'Display name is required'
  }

  if (!form.value.emailName) {
    errors.value.emailName = 'Email name is required'
  } else if (!/^[a-zA-Z0-9]+$/.test(form.value.emailName)) {
    errors.value.emailName = 'Only letters and numbers are allowed'
  }
  
  if (!form.value.simNumber) {
    errors.value.simNumber = 'SIM number is required'
  }
  
  if (!form.value.regularEmail) {
    errors.value.regularEmail = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.regularEmail)) {
    errors.value.regularEmail = 'Invalid email format'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    await userStore.register({
      cosmicalName: form.value.displayName,
      emailName: form.value.emailName,
      cosmicalEmail: cosmicalEmail.value,
      simNumber: form.value.simNumber,
      regularEmail: form.value.regularEmail
    })
  } catch (error) {
    errors.value.submit = error.message
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 max-w-md mx-auto">
    <div>
      <label class="block text-sm font-medium text-gray-300">Display Name</label>
      <input
        v-model="form.displayName"
        type="text"
        placeholder="Enter your display name"
        class="mt-1 block w-full rounded-md bg-gray-800/80 border-0 text-white placeholder-gray-500
               shadow-sm shadow-gray-900/50
               hover:ring-2 hover:ring-blue-500/30 hover:shadow-blue-900/20
               focus:ring-2 focus:ring-blue-500/50 focus:shadow-blue-900/30
               transition-all duration-300"
        :class="{ 'ring-2 ring-red-500/50 focus:ring-red-500/50 hover:ring-red-500/30': errors.displayName }"
      />
      <p class="mt-1 text-sm text-gray-400">This is how you'll appear to others</p>
      <p v-if="errors.displayName" class="mt-1 text-sm text-red-500">{{ errors.displayName }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-300">Email Name</label>
      <input
        v-model="form.emailName"
        type="text"
        placeholder="Enter your email name"
        class="mt-1 block w-full rounded-md bg-gray-800/80 border-0 text-white placeholder-gray-500
               shadow-sm shadow-gray-900/50
               hover:ring-2 hover:ring-blue-500/30 hover:shadow-blue-900/20
               focus:ring-2 focus:ring-blue-500/50 focus:shadow-blue-900/30
               transition-all duration-300"
        :class="{ 'ring-2 ring-red-500/50 focus:ring-red-500/50 hover:ring-red-500/30': errors.emailName }"
      />
      <p class="mt-1 text-sm text-gray-400">This will be used for your @csmcl.space email</p>
      <p v-if="errors.emailName" class="mt-1 text-sm text-red-500">{{ errors.emailName }}</p>
      
      <!-- Cosmical Email Preview -->
      <div class="mt-2 p-3 bg-gray-800 rounded-md">
        <p class="text-sm text-gray-400">Your Cosmical Email will be:</p>
        <p class="font-mono text-blue-400">{{ cosmicalEmail }}</p>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-300">SIM Number</label>
      <input
        v-model="form.simNumber"
        type="text"
        placeholder="Enter your SIM number"
        class="mt-1 block w-full rounded-md bg-gray-800/80 border-0 text-white placeholder-gray-500
               shadow-sm shadow-gray-900/50
               hover:ring-2 hover:ring-blue-500/30 hover:shadow-blue-900/20
               focus:ring-2 focus:ring-blue-500/50 focus:shadow-blue-900/30
               transition-all duration-300"
        :class="{ 'ring-2 ring-red-500/50 focus:ring-red-500/50 hover:ring-red-500/30': errors.simNumber }"
      />
      <p v-if="errors.simNumber" class="mt-1 text-sm text-red-500">{{ errors.simNumber }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-300">Email for Verification</label>
      <input
        v-model="form.regularEmail"
        type="email"
        placeholder="Enter your regular email"
        class="mt-1 block w-full rounded-md bg-gray-800/80 border-0 text-white placeholder-gray-500
               shadow-sm shadow-gray-900/50
               hover:ring-2 hover:ring-blue-500/30 hover:shadow-blue-900/20
               focus:ring-2 focus:ring-blue-500/50 focus:shadow-blue-900/30
               transition-all duration-300"
        :class="{ 'ring-2 ring-red-500/50 focus:ring-red-500/50 hover:ring-red-500/30': errors.regularEmail }"
      />
      <p v-if="errors.regularEmail" class="mt-1 text-sm text-red-500">{{ errors.regularEmail }}</p>
    </div>

    <div v-if="errors.submit" class="p-3 bg-red-500 bg-opacity-20 rounded text-red-500 text-sm">
      {{ errors.submit }}
    </div>

    <button
      type="submit"
      class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
      :disabled="userStore.isLoading"
    >
      {{ userStore.isLoading ? 'Registering...' : 'Register' }}
    </button>
  </form>
</template>
