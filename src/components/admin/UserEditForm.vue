<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
        <h2 class="text-2xl font-bold text-white mb-6">{{ isNewUser ? 'Create New User' : 'Edit User' }}</h2>
        
        <form @submit.prevent="validateAndSave" class="space-y-6">
          <!-- Display Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Display Name</label>
            <input
              v-model="formData.displayName"
              type="text"
              :class="[
                'mt-1 w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2',
                errors.displayName ? 'border-red-500/50 focus:ring-red-500/50' : 'border-gray-700/50 focus:ring-blue-500/50'
              ]"
              placeholder="Enter display name"
            />
            <p v-if="errors.displayName" class="mt-1 text-sm text-red-400">{{ errors.displayName }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Email</label>
            <input
              v-model="formData.email"
              type="email"
              :class="[
                'mt-1 w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2',
                errors.email ? 'border-red-500/50 focus:ring-red-500/50' : 'border-gray-700/50 focus:ring-blue-500/50'
              ]"
              placeholder="Enter email address"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
          </div>

          <!-- Cosmical Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Cosmical Name</label>
            <input
              v-model="formData.cosmicalName"
              type="text"
              :class="[
                'mt-1 w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2',
                errors.cosmicalName ? 'border-red-500/50 focus:ring-red-500/50' : 'border-gray-700/50 focus:ring-blue-500/50'
              ]"
              placeholder="Enter Cosmical name"
            />
            <p v-if="errors.cosmicalName" class="mt-1 text-sm text-red-400">{{ errors.cosmicalName }}</p>
          </div>

          <!-- Role Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-300">User Role</label>
            <select
              v-model="formData.role"
              :class="[
                'mt-1 w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2',
                errors.role ? 'border-red-500/50 focus:ring-red-500/50' : 'border-gray-700/50 focus:ring-blue-500/50'
              ]"
            >
              <option value="user">Regular User</option>
              <option value="explorer">Explorer</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-sm text-red-400">{{ errors.role }}</p>
            <p v-else class="mt-1 text-sm text-gray-500">
              {{ formData.role === 'explorer' ? 'Explorer accounts are auto-verified and do not require a recovery phrase' : 'Regular users require a recovery phrase for account security' }}
            </p>
          </div>

          <!-- Recovery Phrase (only for regular users) -->
          <div v-if="formData.role === 'user'" class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">Recovery Phrase</label>
            <div class="flex gap-2">
              <input
                v-model="formData.phrase"
                type="text"
                :class="[
                  'flex-1 px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2',
                  errors.phrase ? 'border-red-500/50 focus:ring-red-500/50' : 'border-gray-700/50 focus:ring-blue-500/50'
                ]"
                placeholder="Enter or generate a recovery phrase"
              />
              <button
                type="button"
                @click="generatePhrase"
                class="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
              >
                Generate
              </button>
            </div>
            <p v-if="errors.phrase" class="text-sm text-red-400">{{ errors.phrase }}</p>
            <p v-else class="text-sm text-gray-500">A valid 12-word BIP39 phrase is required for account recovery</p>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4 pt-6">
            <button
              type="button"
              @click="confirmCancel"
              class="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">
                <i class="fas fa-spinner fa-spin mr-2"></i>Saving...
              </span>
              <span v-else>
                {{ isNewUser ? 'Create User' : 'Save Changes' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Notifications -->
  <Notification
    v-if="notification.show"
    :type="notification.type"
    :title="notification.title"
    :message="notification.message"
    @close="notification.show = false"
  />

  <!-- Confirmation Dialog -->
  <div v-if="showConfirmDialog" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-medium text-white mb-2">{{ confirmDialog.title }}</h3>
      <p class="text-gray-400 mb-6">{{ confirmDialog.message }}</p>
      <div class="flex justify-end gap-4">
        <button
          @click="showConfirmDialog = false"
          class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { userDb } from '../../services/userDb'
import Notification from '../shared/Notification.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formData = ref({
  displayName: '',
  email: '',
  cosmicalName: '',
  role: 'user',
  phrase: '',
  isVerified: false
})

const errors = ref({})
const isSubmitting = ref(false)
const showConfirmDialog = ref(false)
const confirmDialog = ref({
  title: '',
  message: '',
  action: null
})

const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: ''
})

const isNewUser = computed(() => !route.params.id)

// Generate Flow-compatible recovery phrase
const generatePhrase = () => {
  try {
    formData.value.phrase = userDb.getRecoveryPhrase()
  } catch (error) {
    notification.value = {
      show: true,
      type: 'error',
      title: 'Error Generating Phrase',
      message: 'Failed to generate a valid recovery phrase. Please try again.'
    }
  }
}

const validateForm = () => {
  errors.value = {}
  let isValid = true
  
  // Display name validation
  if (!formData.value.displayName?.trim()) {
    errors.value.displayName = 'Display name is required'
    isValid = false
  } else if (formData.value.displayName.length < 3) {
    errors.value.displayName = 'Display name must be at least 3 characters'
    isValid = false
  }
  
  // Email validation
  if (!formData.value.email?.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!isValidEmail(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Cosmical name validation
  if (!formData.value.cosmicalName?.trim()) {
    errors.value.cosmicalName = 'Cosmical name is required'
    isValid = false
  } else if (formData.value.cosmicalName.length < 3) {
    errors.value.cosmicalName = 'Cosmical name must be at least 3 characters'
    isValid = false
  } else if (isNewUser.value && userExists(formData.value.cosmicalName)) {
    errors.value.cosmicalName = 'This Cosmical name is already taken'
    isValid = false
  }

  // Role validation
  if (!formData.value.role) {
    errors.value.role = 'Role selection is required'
    isValid = false
  }

  // Phrase validation (only for regular users)
  if (formData.value.role === 'user') {
    if (!formData.value.phrase?.trim()) {
      errors.value.phrase = 'Recovery phrase is required for regular users'
      isValid = false
    } else if (!userDb.validatePhrase(formData.value.phrase.trim())) {
      errors.value.phrase = 'Please enter a valid 12-word BIP39 recovery phrase'
      isValid = false
    }
  }
  
  return isValid
}

const saveUser = async () => {
  const userData = {
    ...formData.value,
    displayName: formData.value.displayName.trim(),
    email: formData.value.email.trim(),
    cosmicalName: formData.value.cosmicalName.trim(),
    isVerified: formData.value.role === 'explorer', // Auto-verify explorer accounts
    phrase: formData.value.role === 'user' ? formData.value.phrase.trim() : undefined
  }
  
  if (isNewUser.value) {
    await userDb.createLocalUser(userData)
  } else {
    await userDb.updateUser(route.params.id, userData)
  }
}

const validateAndSave = async () => {
  if (!validateForm()) return
  
  try {
    isSubmitting.value = true
    await saveUser()
    
    notification.value = {
      show: true,
      type: 'success',
      title: isNewUser.value ? 'User Created' : 'User Updated',
      message: isNewUser.value 
        ? 'New user has been successfully created'
        : 'User details have been successfully updated'
    }
    
    router.push({ name: 'admin-users' })
  } catch (error) {
    notification.value = {
      show: true,
      type: 'error',
      title: 'Error',
      message: error.message || 'An error occurred while saving the user'
    }
  } finally {
    isSubmitting.value = false
  }
}

const confirmCancel = () => {
  confirmDialog.value = {
    title: 'Discard Changes?',
    message: 'Are you sure you want to discard your changes? Any unsaved changes will be lost.',
    action: () => router.push({ name: 'admin-users' })
  }
  showConfirmDialog.value = true
}

const handleConfirm = () => {
  if (confirmDialog.value.action) {
    confirmDialog.value.action()
  }
  showConfirmDialog.value = false
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const userExists = (cosmicalName) => {
  return userDb.getLocalUsers().some(u => u.cosmicalName.toLowerCase() === cosmicalName.toLowerCase())
}

onMounted(async () => {
  if (!isNewUser.value) {
    const userId = route.params.id
    const user = userDb.getLocalUsers().find(u => u.cosmicalName === userId)
    if (user) {
      formData.value = {
        displayName: user.displayName || '',
        email: user.email || '',
        cosmicalName: user.cosmicalName || '',
        role: user.role || 'user',
        phrase: user.phrase || '',
        isVerified: user.isVerified || false
      }
    } else {
      notification.value = {
        show: true,
        type: 'error',
        title: 'User Not Found',
        message: 'The requested user could not be found'
      }
      router.push({ name: 'admin-users' })
    }
  }
})
</script>