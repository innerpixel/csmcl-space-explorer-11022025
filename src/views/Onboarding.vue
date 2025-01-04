<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import IdentityForm from '../components/registration/IdentityForm.vue'
import VerificationForm from '../components/registration/VerificationForm.vue'
import SpaceSetup from '../components/space-setup/SpaceSetup.vue'

const route = useRoute()

const currentStep = computed(() => route.name || 'identity')

const steps = [
  { id: 'identity', name: 'Identity', icon: '👤' },
  { id: 'verify', name: 'Verify', icon: '✉️' },
  { id: 'space', name: 'Space', icon: '🚀' }
]

const stepInfo = computed(() => {
  switch (currentStep.value) {
    case 'verify':
      return {
        title: 'Verify Your Email',
        subtitle: 'Enter the verification code we sent to your email',
        component: VerificationForm
      }
    case 'space':
      return {
        title: 'Set Up Your Space',
        subtitle: 'Choose your space type and size to get started',
        component: SpaceSetup
      }
    default:
      return {
        title: 'Create Your Identity',
        subtitle: 'Join the decentralized future. Create your unique identity to start using CSMCL.',
        component: IdentityForm
      }
  }
})

const currentStepIndex = computed(() => 
  steps.findIndex(step => step.id === currentStep.value)
)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-16">
    <!-- Header -->
    <header class="pt-8 pb-4 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <!-- Progress Steps -->
        <nav aria-label="Progress" class="mb-8">
          <ol role="list" class="flex items-center justify-center gap-4 sm:gap-8">
            <li v-for="(step, index) in steps" :key="step.id" class="flex items-center">
              <div class="flex flex-col items-center">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                  :class="[
                    index < currentStepIndex ? 'bg-blue-500 text-white' :
                    index === currentStepIndex ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500' :
                    'bg-gray-800/50 text-gray-500'
                  ]"
                >
                  {{ step.icon }}
                </div>
                <span 
                  class="mt-2 text-sm font-medium"
                  :class="[
                    index <= currentStepIndex ? 'text-blue-400' : 'text-gray-500'
                  ]"
                >
                  {{ step.name }}
                </span>
              </div>
              <div
                v-if="index !== steps.length - 1"
                class="hidden sm:block w-20 h-0.5 mx-2"
                :class="[
                  index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-700'
                ]"
              />
            </li>
          </ol>
        </nav>

        <h1 class="text-3xl font-bold text-white mb-2">{{ stepInfo.title }}</h1>
        <p class="text-gray-400 max-w-md mx-auto">
          {{ stepInfo.subtitle }}
        </p>
      </div>
    </header>

    <!-- Main Form -->
    <main class="max-w-md mx-auto px-4 py-8">
      <div class="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <div class="p-6">
          <router-view v-if="!stepInfo.component" />
          <component v-else :is="stepInfo.component" />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-md mx-auto px-4 py-6 text-center">
      <p class="text-sm text-gray-500">
        Already have an account? 
        <router-link 
          to="/login" 
          class="text-blue-400 hover:text-blue-300"
        >
          Sign in
        </router-link>
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* Glass effect for cards */
.glass-card {
  background: rgba(17, 24, 39, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
