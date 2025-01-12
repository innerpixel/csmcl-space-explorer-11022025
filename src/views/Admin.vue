<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">User Management</h1>
            <p class="text-gray-400">Manage users and switch between profiles</p>
          </div>
        </div>
      </header>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <!-- Search -->
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg
                   text-white placeholder-gray-500 focus:outline-none focus:ring-2
                   focus:ring-blue-500/50"
          />
        </div>

        <!-- Filters -->
        <div class="flex gap-2">
          <select
            v-model="selectedRole"
            class="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg
                   text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Roles</option>
            <option v-for="role in Object.values(ROLES)" :key="role" :value="role">
              {{ role.charAt(0).toUpperCase() + role.slice(1) }}
            </option>
          </select>

          <select
            v-model="sortBy"
            class="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg
                   text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="displayName">Name</option>
            <option value="role">Role</option>
            <option value="createdAt">Created</option>
          </select>
        </div>
      </div>

      <!-- Current Profile -->
      <div v-if="userStore.originalUser" class="mb-6 p-4 bg-blue-500/10 rounded-lg">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-blue-400">Currently viewing as:</span>
            <span class="text-white ml-2">{{ userStore.user.displayName }}</span>
          </div>
          <button
            @click="revertToOriginal"
            class="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
          >
            Return to Original Profile
          </button>
        </div>
      </div>

      <!-- User List -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <router-link
          to="/admin/users/new"
          class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border-2 border-dashed border-gray-700/50 hover:border-purple-500/50 transition-colors group flex flex-col items-center justify-center py-6"
        >
          <div class="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/30 transition-colors">
            <span class="text-2xl">➕</span>
          </div>
          <h3 class="text-lg font-medium text-purple-400 mt-4">Add New User</h3>
          <p class="text-sm text-gray-400 mt-1">Create a new user account</p>
        </router-link>

        <div
          v-for="user in filteredUsers"
          :key="user.cosmicalName"
          class="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4"
        >
          <div class="flex flex-col gap-4">
            <!-- User Info -->
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center text-white">
                {{ user.displayName?.[0]?.toUpperCase() || '?' }}
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-medium text-white">
                  {{ user.displayName }}
                </h3>
                <p class="text-sm text-gray-400">
                  {{ user.cosmicalName }}
                </p>
                <div class="mt-2 flex gap-2">
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getRoleClass(user.role)"
                  >
                    {{ user.role || 'user' }}
                  </span>
                  <span
                    v-if="!user.isVerified"
                    class="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400"
                  >
                    Pending
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 justify-end">
              <button
                v-if="canSwitchToProfile(userStore.user?.role, user.role)"
                @click="switchToProfile(user.cosmicalName)"
                class="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
              >
                Switch to Profile
              </button>
              <button
                v-if="canEditUser(userStore.user?.role, user.role)"
                @click="editUser(user)"
                class="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
              >
                Edit
              </button>
              <button
                v-if="canEditUser(userStore.user?.role, user.role)"
                @click="deleteUser(user.cosmicalName)"
                class="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredUsers.length === 0"
        class="text-center py-12 text-gray-500"
      >
        No users found matching your criteria
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { userDb } from '../services/userDb'
import { 
  ROLES, 
  canEditUser, 
  canSwitchToProfile 
} from '../utils/roles'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')
const selectedRole = ref('all')
const sortBy = ref('displayName')

// Get all users (excluding bots)
const users = computed(() => {
  const defaultUsers = userDb.getDefaultUsers().filter(user => !user.cosmicalName.endsWith('_BOT'))
  const localUsers = userDb.getLocalUsers()
  const submittedUsers = userDb.getSubmittedUsers()
  return [...defaultUsers, ...localUsers, ...submittedUsers]
})

// Filter and sort users
const filteredUsers = computed(() => {
  let result = [...users.value]
  
  // Apply role filter
  if (selectedRole.value !== 'all') {
    result = result.filter(user => user.role === selectedRole.value)
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.displayName?.toLowerCase().includes(query) ||
      user.cosmicalName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  }

  // Sort users
  result.sort((a, b) => {
    const aValue = a[sortBy.value]
    const bValue = b[sortBy.value]
    if (!aValue && !bValue) return 0
    if (!aValue) return 1
    if (!bValue) return -1
    return aValue.localeCompare(bValue)
  })

  return result
})

// Role-based styling
const getRoleClass = (role) => ({
  'admin': 'bg-purple-500/20 text-purple-400',
  'explorer': 'bg-blue-500/20 text-blue-400',
  'user': 'bg-green-500/20 text-green-400'
}[role] || 'bg-gray-500/20 text-gray-400')

// Profile management
const switchToProfile = async (cosmicalName) => {
  await userStore.switchProfile(cosmicalName)
}

const revertToOriginal = async () => {
  await userStore.revertToOriginalProfile()
}

// User management
const editUser = (user) => {
  router.push({
    name: 'admin-user-edit',
    params: { id: user.cosmicalName }
  })
}

const deleteUser = async (cosmicalName) => {
  if (confirm('Are you sure you want to delete this user?')) {
    await userDb.deleteUser(cosmicalName)
  }
}
</script>
