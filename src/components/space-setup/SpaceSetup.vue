<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  spaceSize: '10',
  spaceType: 'personal',
  customDomain: ''
})

const errors = ref({
  spaceSize: '',
  spaceType: '',
  customDomain: ''
})

const spaceTypes = [
  {
    id: 'personal',
    name: 'Personal Space',
    description: 'Perfect for individual use',
    icon: '👤'
  },
  {
    id: 'team',
    name: 'Team Space',
    description: 'Collaborate with your team',
    icon: '👥'
  }
]

const spaceSizes = [
  { value: '10', label: '10 GB' },
  { value: '50', label: '50 GB' },
  { value: '100', label: '100 GB' },
  { value: '500', label: '500 GB' }
]

const validateForm = () => {
  let isValid = true
  errors.value = {
    spaceSize: '',
    spaceType: '',
    customDomain: ''
  }

  if (!form.value.spaceSize) {
    errors.value.spaceSize = 'Please select a space size'
    isValid = false
  }

  if (!form.value.spaceType) {
    errors.value.spaceType = 'Please select a space type'
    isValid = false
  }

  if (form.value.customDomain && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.csmcl\.id$/.test(form.value.customDomain)) {
    errors.value.customDomain = 'Please enter a valid domain (e.g., myspace.csmcl.id)'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await userStore.setupSpace({
      size: form.value.spaceSize,
      type: form.value.spaceType,
      customDomain: form.value.customDomain || undefined
    })
    
    router.push('/dashboard')
  } catch (error) {
    console.error('Space setup failed:', error)
  }
}

defineExpose({
  form,
  errors,
  handleSubmit
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Space Type Selection -->
    <div class="space-y-4">
      <label class="block text-sm font-medium text-gray-300">
        Space Type
      </label>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          v-for="type in spaceTypes"
          :key="type.id"
          class="relative flex cursor-pointer rounded-lg border bg-gray-800/50 p-4 border-gray-700/50
                 focus:outline-none"
          :class="[
            form.spaceType === type.id
              ? 'border-blue-500 ring-2 ring-blue-500'
              : 'hover:border-gray-600'
          ]"
          @click="form.spaceType = type.id"
        >
          <div class="flex w-full items-center justify-between">
            <div class="flex items-center">
              <div class="text-sm">
                <p class="font-medium text-white flex items-center gap-2">
                  <span class="text-xl">{{ type.icon }}</span>
                  {{ type.name }}
                </p>
                <p class="text-gray-400">{{ type.description }}</p>
              </div>
            </div>
            <div
              v-show="form.spaceType === type.id"
              class="shrink-0 text-blue-500"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" opacity="0.2" />
                <path
                  d="M7 13l3 3 7-7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p v-if="errors.spaceType" class="mt-2 text-sm text-red-400">
        {{ errors.spaceType }}
      </p>
    </div>

    <!-- Space Size Selection -->
    <div class="space-y-4">
      <label class="block text-sm font-medium text-gray-300">
        Space Size
      </label>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="size in spaceSizes"
          :key="size.value"
          class="relative flex cursor-pointer rounded-lg border bg-gray-800/50 p-4 border-gray-700/50
                 focus:outline-none"
          :class="[
            form.spaceSize === size.value
              ? 'border-blue-500 ring-2 ring-blue-500'
              : 'hover:border-gray-600'
          ]"
          @click="form.spaceSize = size.value"
        >
          <div class="flex w-full items-center justify-between">
            <p class="text-sm font-medium text-white">{{ size.label }}</p>
            <div
              v-show="form.spaceSize === size.value"
              class="shrink-0 text-blue-500"
            >
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" opacity="0.2" />
                <path
                  d="M7 13l3 3 7-7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p v-if="errors.spaceSize" class="mt-2 text-sm text-red-400">
        {{ errors.spaceSize }}
      </p>
    </div>

    <!-- Custom Domain -->
    <div>
      <label for="customDomain" class="block text-sm font-medium text-gray-300">
        Custom Domain (Optional)
      </label>
      <div class="mt-1">
        <div class="flex rounded-lg shadow-sm">
          <input
            id="customDomain"
            v-model="form.customDomain"
            type="text"
            class="block w-full rounded-lg px-4 py-2 bg-gray-900/50 border border-gray-700/50
                   text-white placeholder-gray-500 focus:outline-none focus:ring-2
                   focus:ring-blue-500/50 focus:border-transparent"
            placeholder="myspace.csmcl.id"
          />
        </div>
      </div>
      <p class="mt-2 text-sm text-gray-500">
        Choose a custom domain for your space (e.g., myspace.csmcl.id)
      </p>
      <p v-if="errors.customDomain" class="mt-2 text-sm text-red-400">
        {{ errors.customDomain }}
      </p>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg
             hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50
             transition-colors duration-300"
    >
      Create Space
    </button>
  </form>
</template>
