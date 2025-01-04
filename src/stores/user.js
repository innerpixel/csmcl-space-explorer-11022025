import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    // User Identity
    user: null,
    email: null,
    phone: null,
    verificationStatus: {
      email: false,
      phone: false
    },

    // Space Configuration
    space: {
      theme: null,
      visibility: 'private',
      accessibility: {
        public: false,
        friends: true,
        private: true
      },
      boundaries: {
        size: 'medium',
        expandable: true
      },
      template: null
    },

    // CSMCL.ID
    csmclId: {
      cosmicalName: null,
      cosmicalEmail: null,
      recoveryPhrase: null,
      spaceBinding: null,
      confirmed: false
    },

    // Wallet
    wallet: {
      address: null,
      connected: false,
      assets: []
    },

    // Onboarding Progress
    onboardingStep: 'identity', // identity -> space -> csmclId -> wallet -> complete
    stepProgress: {
      identity: {
        started: false,
        completed: false
      },
      space: {
        started: false,
        completed: false
      },
      csmclId: {
        started: false,
        completed: false
      },
      wallet: {
        started: false,
        completed: false
      }
    }
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentStep: (state) => state.onboardingStep,
    canProceedToSpace: (state) => 
      state.stepProgress.identity.completed &&
      state.verificationStatus.email &&
      state.verificationStatus.phone,
    
    canProceedToCsmclId: (state) =>
      state.stepProgress.space.completed &&
      state.space.theme &&
      state.space.template,
    
    canProceedToWallet: (state) =>
      state.stepProgress.csmclId.completed &&
      state.csmclId.confirmed,
    
    isOnboardingComplete: (state) =>
      state.stepProgress.wallet.completed &&
      state.wallet.connected,
    
    spaceConfiguration: (state) => state.space,
    csmclIdDetails: (state) => state.csmclId
  },

  actions: {
    // Identity Verification
    async verifyEmail(email) {
      // API call to verify email
      this.verificationStatus.email = true
      this.email = email
    },

    async verifyPhone(phone) {
      // API call to verify phone
      this.verificationStatus.phone = true
      this.phone = phone
    },

    // Space Setup
    setSpaceTheme(theme) {
      this.space.theme = theme
    },

    setSpaceVisibility(visibility) {
      this.space.visibility = visibility
    },

    setSpaceAccessibility(settings) {
      this.space.accessibility = {
        ...this.space.accessibility,
        ...settings
      }
    },

    setSpaceBoundaries(boundaries) {
      this.space.boundaries = {
        ...this.space.boundaries,
        ...boundaries
      }
    },

    setSpaceTemplate(template) {
      this.space.template = template
    },

    // CSMCL.ID Creation
    async setupCsmclId(details) {
      if (!this.canProceedToCsmclId) {
        throw new Error('Complete space setup first')
      }

      this.csmclId = {
        ...this.csmclId,
        ...details,
        spaceBinding: {
          spaceId: generateSpaceId(),
          timestamp: new Date().toISOString()
        }
      }
    },

    async confirmCsmclId() {
      if (!this.csmclId.cosmicalName || !this.csmclId.cosmicalEmail) {
        throw new Error('CSMCL.ID details incomplete')
      }

      this.csmclId.confirmed = true
      // API call to register permanent CSMCL.ID
    },

    // Wallet Integration
    async connectWallet(address) {
      if (!this.canProceedToWallet) {
        throw new Error('Confirm CSMCL.ID first')
      }

      this.wallet.address = address
      this.wallet.connected = true
      // Initialize space assets
    },

    // Progress Tracking
    startStep(step) {
      if (this.stepProgress[step]) {
        this.stepProgress[step].started = true
      }
    },

    completeStep(step) {
      if (this.stepProgress[step]) {
        this.stepProgress[step].completed = true
        this.advanceToNextStep(step)
      }
    },

    advanceToNextStep(currentStep) {
      const steps = ['identity', 'space', 'csmclId', 'wallet', 'complete']
      const currentIndex = steps.indexOf(currentStep)
      
      if (currentIndex < steps.length - 1) {
        this.onboardingStep = steps[currentIndex + 1]
      }
    },

    // Reset
    resetOnboarding() {
      this.$reset()
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage,
        paths: ['user', 'email', 'phone', 'space', 'onboardingStep', 'stepProgress']
      }
    ]
  }
})

function generateSpaceId() {
  return 'sp_' + Math.random().toString(36).substr(2, 9)
}
