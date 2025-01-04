<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-white">Complete Your CSMCL.Space Setup</h2>
      <div class="flex items-center space-x-2">
        <div class="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            :style="{ width: `${overallProgress}%` }"
          ></div>
        </div>
        <div class="text-sm text-gray-400">
          {{ overallProgress }}% Complete
        </div>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="space-y-4">
      <template v-if="userStore.isExplorer">
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-white">Explorer Mode Progress</h3>
          <div class="space-y-4">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex items-center space-x-4"
            >
              <!-- Step Status Icon -->
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="[
                  step.isComplete ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'
                ]"
              >
                <span v-if="step.isComplete" class="text-lg">✓</span>
                <span v-else class="text-sm">{{ index + 1 }}</span>
              </div>

              <!-- Step Content -->
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium" :class="[
                    step.isComplete ? 'text-green-400' : 'text-gray-300'
                  ]">
                    {{ step.title }}
                  </h4>
                  <span class="text-xs" :class="[
                    step.isComplete ? 'text-green-400' : 'text-gray-500'
                  ]">
                    {{ step.isComplete ? 'Completed' : 'Pending' }}
                  </span>
                </div>
                <p class="mt-1 text-xs text-gray-500">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div 
          v-for="(section, key) in sectionProgress" 
          :key="key"
          class="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 
                 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500"
          :class="{ 'border-blue-500/50': currentStep === key }"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div class="text-2xl">{{ section.icon }}</div>
                <div>
                  <h3 class="text-lg font-medium text-white capitalize">
                    {{ key.replace('csmclId', 'CSMCL.ID') }} Setup
                  </h3>
                  <p class="text-gray-400 mt-1">
                    {{ section.percent }}% Complete
                  </p>
                </div>
              </div>
              <button
                v-if="!stepProgress[key].completed"
                @click="$event => {
                  if (key === 'identity') startIdentityVerification()
                  else if (key === 'space') startSpaceConfiguration()
                  else if (key === 'csmclId') startCsmclIdSetup()
                  else if (key === 'wallet') startWalletIntegration()
                }"
                :disabled="
                  (key === 'space' && !canConfigureSpace) ||
                  (key === 'csmclId' && !canSetupCsmclId) ||
                  (key === 'wallet' && !canIntegrateWallet)
                "
                class="px-4 py-2 bg-gradient-to-r transition-all duration-300 text-white 
                       rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                :class="section.color"
              >
                {{ stepProgress[key].started ? 'Continue Setup' : 'Start Setup' }}
              </button>
              <div v-else class="flex items-center space-x-2 text-green-400">
                <span>Completed</span>
                <span>✓</span>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r transition-all duration-500"
                :class="section.color"
                :style="{ width: `${section.percent}%` }"
              ></div>
            </div>
            <div v-if="key === 'identity'" class="mt-4 bg-gray-800/30 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4">
                <template v-for="(detail, key) in userStore.identityDetails" :key="key">
                  <div>
                    <div class="text-sm text-gray-400">{{ detail.label }}</div>
                    <div class="flex items-center mt-1">
                      <span 
                        class="text-white"
                        :class="{ 'text-gray-500': !detail.completed }"
                      >
                        {{ detail.value }}
                      </span>
                      <span 
                        v-if="detail.completed" 
                        class="ml-2 text-green-400"
                        aria-label="Verified"
                      >
                        ✓
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const currentStep = computed(() => userStore.currentStep)
const stepProgress = computed(() => userStore.stepProgress)

const completedSteps = computed(() => {
  return Object.values(stepProgress.value).filter(step => step.completed).length
})

const totalSteps = computed(() => Object.keys(stepProgress.value).length)

const overallProgress = computed(() => {
  return Math.round((completedSteps.value / totalSteps.value) * 100)
})

const sectionProgress = computed(() => ({
  identity: {
    percent: userStore.identityProgress,
    color: 'from-purple-500 to-purple-600',
    icon: '👤'
  },
  space: {
    percent: userStore.spaceProgress,
    color: 'from-blue-500 to-blue-600',
    icon: '🌌'
  },
  csmclId: {
    percent: userStore.csmclIdProgress,
    color: 'from-green-500 to-green-600',
    icon: '🆔'
  },
  wallet: {
    percent: userStore.walletProgress,
    color: 'from-yellow-500 to-yellow-600',
    icon: '💳'
  }
}))

const canConfigureSpace = computed(() => 
  stepProgress.value.identity.completed || userStore.isExplorer
)

const canSetupCsmclId = computed(() => 
  stepProgress.value.space.completed || userStore.isExplorer
)

const canIntegrateWallet = computed(() => 
  stepProgress.value.csmclId.completed || userStore.isExplorer
)

const steps = computed(() => [
  {
    title: 'Configure Space',
    description: 'Set up your space preferences and theme',
    isComplete: userStore.space?.theme ? true : false
  },
  {
    title: 'View Documentation',
    description: 'Learn about CSMCL features and capabilities',
    isComplete: userStore.hasViewedDocs || false
  },
  {
    title: 'Complete Profile',
    description: 'Review your explorer profile settings',
    isComplete: true // Always complete for explorers
  }
])

const startIdentityVerification = () => {
  userStore.startStep('identity')
  router.push('/onboarding/identity')
}

const startSpaceConfiguration = () => {
  userStore.startStep('space')
  router.push('/onboarding/space')
}

const startCsmclIdSetup = () => {
  userStore.startStep('csmclId')
  router.push('/onboarding/csmclId')
}

const startWalletIntegration = () => {
  userStore.startStep('wallet')
  router.push('/onboarding/wallet')
}
</script>
