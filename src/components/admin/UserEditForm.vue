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
            />
            <p v-if="errors.displayName" class="mt-1 text-sm text-red-400">{{ errors.displayName }}</p>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-300">Role</label>
            <select
              v-model="formData.role"
              :class="[
                'mt-1 w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white focus:outline-none focus:ring-2',
                errors.role ? 'border-red-500/50 focus:ring-red-500/50' : 'border-gray-700/50 focus:ring-blue-500/50'
              ]"
            >
              <option v-for="role in availableRoles" :key="role" :value="role">
                {{ role.charAt(0).toUpperCase() + role.slice(1) }}
              </option>
            </select>
            <p v-if="errors.role" class="mt-1 text-sm text-red-400">{{ errors.role }}</p>
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
import { ROLES, canManageRole } from '../../utils/roles'
import Notification from '../shared/Notification.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formData = ref({
  displayName: '',
  role: 'user'
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

const availableRoles = computed(() => {
  return Object.values(ROLES).filter(role => 
    canManageRole(userStore.user?.role, role)
  )
})

onMounted(async () => {
  if (!isNewUser.value) {
    const userId = route.params.id
    const user = userDb.getLocalUsers().find(u => u.cosmicalName === userId)
    if (user) {
      formData.value = {
        displayName: user.displayName,
        role: user.role || 'user'
      }
    }
  }
})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.displayName?.trim()) {
    errors.value.displayName = 'Display name is required'
  } else if (formData.value.displayName.length < 3) {
    errors.value.displayName = 'Display name must be at least 3 characters'
  }
  
  if (!formData.value.role) {
    errors.value.role = 'Role is required'
  } else if (!availableRoles.value.includes(formData.value.role)) {
    errors.value.role = 'Invalid role selected'
  }
  
  return Object.keys(errors.value).length === 0
}

const validateAndSave = async () => {
  if (!validateForm()) return
  
  try {
    isSubmitting.value = true
    await saveUser()
    
    notification.value = {
      show: true,
      type: 'success',
      title: isNewUser.value ? 'User created successfully' : 'User updated successfully'
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
  if (isNewUser.value) {
    await userDb.createUser(formData.value)
  } else {
    const userId = route.params.id
    await userDb.updateUser(userId, formData.value)
  }
}

const confirmCancel = () => {
  if (formData.value.displayName || formData.value.role !== 'user') {
    confirmDialog.value = {
      title: 'Discard Changes?',
      message: 'Are you sure you want to discard your changes?',
      action: () => router.push({ name: 'admin-users' })
    }
    showConfirmDialog.value = true
  } else {
    router.push({ name: 'admin-users' })
  }
}

const handleConfirm = () => {
  if (confirmDialog.value.action) {
    confirmDialog.value.action()
  }
  showConfirmDialog.value = false
}
</script>
