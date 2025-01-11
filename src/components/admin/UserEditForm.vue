<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6">
        <h2 class="text-2xl font-bold text-white mb-6">{{ isNewUser ? 'Create User' : 'Edit User' }}</h2>
        
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

          <!-- Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              @click="confirmCancel"
              class="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting">Saving...</span>
              <span v-else>{{ isNewUser ? 'Create User' : 'Save Changes' }}</span>
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
          class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
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
  role: 'user' // Default role is always 'user'
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

onMounted(async () => {
  if (!isNewUser.value) {
    const userId = route.params.id
    const user = userDb.getLocalUsers().find(u => u.cosmicalName === userId)
    if (user) {
      formData.value = {
        displayName: user.displayName,
        email: user.email,
        cosmicalName: user.cosmicalName,
        role: 'user' // Keep role as 'user' even when editing
      }
    }
  }
})

const validateForm = () => {
  errors.value = {}
  
  // Display name validation
  if (!formData.value.displayName?.trim()) {
    errors.value.displayName = 'Display name is required'
  } else if (formData.value.displayName.length < 3) {
    errors.value.displayName = 'Display name must be at least 3 characters'
  }
  
  // Email validation
  if (!formData.value.email?.trim()) {
    errors.value.email = 'Email is required'
  } else if (!isValidEmail(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  // Cosmical name validation
  if (!formData.value.cosmicalName?.trim()) {
    errors.value.cosmicalName = 'Cosmical name is required'
  } else if (formData.value.cosmicalName.length < 3) {
    errors.value.cosmicalName = 'Cosmical name must be at least 3 characters'
  } else if (isNewUser.value && userExists(formData.value.cosmicalName)) {
    errors.value.cosmicalName = 'This Cosmical name is already taken'
  }
  
  return Object.keys(errors.value).length === 0
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const userExists = (cosmicalName) => {
  return userDb.getLocalUsers().some(u => u.cosmicalName.toLowerCase() === cosmicalName.toLowerCase())
}

const validateAndSave = async () => {
  if (!validateForm()) return
  
  try {
    isSubmitting.value = true
    await saveUser()
    
    notification.value = {
      show: true,
      type: 'success',
      title: isNewUser.value ? 'User created successfully' : 'User updated successfully',
      message: isNewUser.value ? 'New user has been created with basic access' : 'User details have been updated'
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

const saveUser = async () => {
  const userData = {
    ...formData.value,
    role: 'user', // Ensure role is always 'user'
    verified: false
  }
  
  if (isNewUser.value) {
    await userDb.createUser(userData)
  } else {
    const userId = route.params.id
    await userDb.updateUser(userId, userData)
  }
}

const confirmCancel = () => {
  confirmDialog.value = {
    title: 'Discard Changes?',
    message: 'Are you sure you want to discard your changes? This action cannot be undone.',
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
</script>
