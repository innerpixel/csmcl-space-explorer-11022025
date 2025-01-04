import { defineStore } from 'pinia'
import { userDb } from '../services/userDb'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    isAdmin: false,
    isExplorer: false,
    isVerified: false,
    displayName: null,
    cosmicalEmail: null,
    explorerExpiry: null,
    verificationDetails: {
      email: null,
      phone: null,
      simNumber: null,
      status: 'pending',
      completedSteps: []
    },
    space: {
      theme: null,
      visibility: 'private'
    },
    wallet: {
      connected: false,
      address: null
    },
    spaceMetrics: {
      activity: { interactions: 0, chatter: 0 },
      network: { connections: 0, pending: 0 },
      transactions: { sent: 0, received: 0 },
      social: { shares: 0, engagement: 0 },
      requests: { sent: 0, received: 0 },
      traffic: { inbound: 0, outbound: 0 }
    },
    stepProgress: {
      space: {
        completed: false,
        progress: 0
      },
      network: {
        completed: false,
        progress: 0
      },
      wallet: {
        completed: false,
        progress: 0
      }
    }
  }),

  getters: {
    isExplorerExpired: (state) => {
      if (!state.explorerExpiry) return false
      return new Date(state.explorerExpiry) < new Date()
    },

    verificationProgress: (state) => {
      const steps = ['identity', 'contact', 'review']
      return {
        completed: state.verificationDetails.completedSteps.length,
        total: steps.length,
        percent: (state.verificationDetails.completedSteps.length / steps.length) * 100
      }
    },

    // Space Progress
    spaceProgress: (state) => {
      if (state.stepProgress.space.completed) return 100
      if (!state.stepProgress.space.completed) return state.stepProgress.space.progress

      let progress = 0
      if (state.space.theme) progress += 20
      if (state.space.visibility) progress += 20
      if (state.space.accessibility) progress += 20
      if (state.space.boundaries) progress += 20
      if (state.space.template) progress += 20
      return progress
    },

    // Wallet Progress
    walletProgress: (state) => {
      if (state.stepProgress.wallet.completed) return 100
      if (!state.stepProgress.wallet.completed) return state.stepProgress.wallet.progress

      let progress = 0
      if (state.wallet.address) progress += 50
      if (state.wallet.connected) progress += 50
      return progress
    },

    // Space Activity Stats
    spaceActivity: (state) => ({
      interactions: state.spaceMetrics.activity.interactions,
      chatter: state.spaceMetrics.activity.chatter
    }),

    // Network Stats
    networkStats: (state) => ({
      connections: state.spaceMetrics.network.connections,
      pending: state.spaceMetrics.network.pending
    }),

    // Transaction Stats
    transactionStats: (state) => ({
      sent: state.spaceMetrics.transactions.sent,
      received: state.spaceMetrics.transactions.received
    }),

    // Social Stats
    socialStats: (state) => ({
      shares: state.spaceMetrics.social.shares,
      engagement: state.spaceMetrics.social.engagement
    }),

    // Request Stats
    requestStats: (state) => ({
      sent: state.spaceMetrics.requests.sent,
      received: state.spaceMetrics.requests.received
    }),

    // Traffic Stats
    trafficStats: (state) => ({
      inbound: state.spaceMetrics.traffic.inbound,
      outbound: state.spaceMetrics.traffic.outbound
    })
  },

  actions: {
    checkAndHandleExplorerExpiry() {
      if (this.isExplorerExpired && this.isExplorer) {
        this.logout()
        return true
      }
      return false
    },

    async login({ cosmicalName }) {
      try {
        const user = userDb.findUser(cosmicalName)
        if (!user) {
          console.error('User not found:', cosmicalName)
          return false
        }

        // Set user state
        this.user = user
        this.isLoggedIn = true
        this.isAdmin = user.role === 'admin'
        this.isExplorer = user.role === 'explorer'
        this.isVerified = user.isVerified
        this.displayName = user.displayName
        this.cosmicalEmail = user.email
        
        if (user.role === 'explorer') {
          const expiryTime = new Date()
          expiryTime.setDate(expiryTime.getDate() + 10) // 10 days from now
          this.explorerExpiry = expiryTime.toISOString()
          userDb.updateUser(cosmicalName, { explorerExpiry: this.explorerExpiry })
        }

        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    async register(userData) {
      try {
        const success = userDb.createUser({
          ...userData,
          role: 'user',
          isVerified: false,
          space: {
            theme: 'default',
            visibility: 'private'
          }
        })

        if (success) {
          return this.login({ cosmicalName: userData.cosmicalName })
        }
        return false
      } catch (error) {
        console.error('Registration error:', error)
        return false
      }
    },

    async loginAsExplorer(cosmicalName = 'CSMCL.Explorer') {
      try {
        const success = await this.login({ cosmicalName })
        if (success) {
          // Update last login for explorer
          userDb.updateUser(cosmicalName, { 
            lastLogin: new Date().toISOString() 
          })
        }
        return success
      } catch (error) {
        console.error('Explorer login error:', error)
        return false
      }
    },

    logout() {
      this.$reset()
      return true
    },

    updateProfile(updates) {
      try {
        if (!this.user?.cosmicalName) {
          throw new Error('No user logged in')
        }

        const success = userDb.updateUser(this.user.cosmicalName, updates)
        if (success) {
          Object.assign(this.user, updates)
          return true
        }
        return false
      } catch (error) {
        console.error('Profile update error:', error)
        return false
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage,
        paths: ['user', 'isLoggedIn', 'isAdmin', 'isExplorer', 'isVerified', 
                'displayName', 'cosmicalEmail', 'explorerExpiry', 
                'verificationDetails', 'space', 'wallet', 'spaceMetrics', 'stepProgress']
      }
    ]
  }
})
