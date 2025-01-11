import { defineStore } from 'pinia'
import { userDb } from '../services/userDb'
import { metricService } from '../services/achievements'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    originalUser: null,  // Track original user when switching
    isLoggedIn: false,
    isAdmin: false,
    isExplorer: false,
    isVerified: false,
    displayName: null,
    cosmicalEmail: null,
    explorerExpiry: null,
    metrics: [], 
    achievements: [], 
    xp: 0,
    level: 'novice',
    gameState: {
      currentLevel: 'novice',
      xp: 0,
      badges: []
    },
    verificationDetails: {
      status: 'pending',
      steps: {
        email: false,
        identity: false,
        security: false
      }
    },
    space: {
      theme: 'default',
      visibility: 'private',
      features: []
    },
    wallet: {
      balance: 0,
      transactions: []
    },
    spaceMetrics: {
      traffic: {
        inbound: 0,
        outbound: 0
      },
      connections: {
        active: 0,
        total: 0
      },
      requests: {
        pending: 0,
        completed: 0
      }
    },
    stepProgress: {
      verification: {
        progress: 0,
        completed: false
      },
      space: {
        progress: 0,
        completed: false
      },
      network: {
        progress: 0,
        completed: false
      }
    }
  }),

  getters: {
    isExplorerExpired: (state) => {
      if (!state.explorerExpiry) return false
      return new Date(state.explorerExpiry) < new Date()
    },

    verificationProgress: (state) => {
      const steps = ['email', 'identity', 'security']
      return {
        completed: Object.values(state.verificationDetails.steps).filter(Boolean).length,
        total: steps.length,
        percent: (Object.values(state.verificationDetails.steps).filter(Boolean).length / steps.length) * 100
      }
    },

    currentLevel: (state) => state.level,

    totalXP: (state) => state.xp,

    currentLevelDetails() {
      return metricService.getLevelDetails(this.level)
    },
    
    nextLevel() {
      const levels = Object.keys(metricService.levels)
      const currentIndex = levels.indexOf(this.level)
      return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null
    },

    nextLevelProgress() {
      if (!this.nextLevel) return 100
      const currentLevel = metricService.levels[this.level]
      const nextLevel = metricService.levels[this.nextLevel]
      const progress = ((this.xp - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
      return Math.min(Math.max(progress, 0), 100)
    }
  },

  actions: {
    checkAndHandleExplorerExpiry() {
      if (this.isExplorerExpired && this.isExplorer) {
        this.logout()
        return true
      }
      return false
    },

    async login({ cosmicalName, phrase }) {
      try {
        const user = userDb.getUser(cosmicalName, true) // Get user with decrypted phrase
        if (!user) {
          return false
        }

        // Verify phrase if provided
        if (phrase && user.phrase && phrase !== user.phrase) {
          return false
        }

        // Set user data in store
        this.user = user
        this.isLoggedIn = true
        this.displayName = user.displayName || cosmicalName
        this.cosmicalEmail = user.email
        this.isAdmin = user.role === 'admin'
        this.isExplorer = user.role === 'explorer'
        this.isVerified = user.verified || false
        this.explorerExpiry = user.explorerExpiry || null

        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    async register(userData) {
      try {
        // Create local user
        const user = await userDb.createLocalUser({
          cosmicalName: userData.cosmicalName,
          displayName: userData.displayName,
          email: userData.email,
          password: userData.password,
          phrase: userData.phrase
        })

        if (user) {
          // Set initial state with progress tracking
          this.user = {
            ...user,
            displayName: user.displayName,
            email: user.email,
            isVerified: false,
            lastUpdated: new Date().toISOString(),
            verificationDetails: {
              status: 'pending',
              steps: {
                identity: true,
                email: false,
                security: false
              },
              progress: {
                current: 'identity',
                completed: ['registration'],
                next: 'email'
              }
            }
          }
          this.isLoggedIn = true

          // Save progress to localStorage
          localStorage.setItem('onboarding_progress', JSON.stringify({
            step: 'identity',
            completed: ['registration'],
            timestamp: new Date().toISOString()
          }))

          // Submit user for onboarding
          await userDb.submitUserToBackend(user.cosmicalName)
          return true
        }
        return false
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },

    async submitUser(cosmicalName) {
      try {
        const success = await userDb.submitUserToBackend(cosmicalName)
        if (success) {
          // Now we can log in the user
          return this.login({ cosmicalName })
        }
        return false
      } catch (error) {
        console.error('User submission error:', error)
        throw error
      }
    },

    async loginAsExplorer(cosmicalName = 'CSMCL EXPLORER') {
      try {
        // Set explorer expiry before login
        const now = new Date()
        const expiry = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)).toISOString()
        userDb.setExplorerExpiry(expiry)

        const success = await this.login({ cosmicalName })
        if (!success) {
          // Clean up if login failed
          userDb.setExplorerExpiry(null)
        }
        return success
      } catch (error) {
        console.error('Explorer login error:', error)
        return false
      }
    },

    logout() {
      // Clear explorer expiry if it was an explorer session
      if (this.isExplorer) {
        userDb.setExplorerExpiry(null)
      }
      this.$reset()
      return true
    },

    async updateProfile(updates) {
      try {
        const success = await userDb.updateUser(this.user?.cosmicalName, updates)
        if (!success) throw new Error('Profile update failed')

        this.$patch(updates)

        // Trigger profile customization achievement
        if (!this.metrics.some(m => m.id === 'customize-profile')) {
          await this.trackMetric('customize-profile', 'profile', {
            userId: this.user.cosmicalName
          })
        }

        return true
      } catch (error) {
        console.error('Profile update error:', error)
        return false
      }
    },

    async updateUserProfile(updates) {
      try {
        if (!this.user) throw new Error('No user logged in')

        // Update local user first
        const updatedUser = await userDb.updateUser(this.user.cosmicalName, updates)
        if (updatedUser) {
          this.user = {
            ...this.user,
            ...updates,
            lastUpdated: new Date().toISOString()
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Profile update error:', error)
        throw error
      }
    },

    async trackMetric(metricId, category, data = {}) {
      // Track metric and get XP
      const earnedXP = metricService.trackMetric(metricId, category, {
        ...data,
        userId: this.user?.cosmicalName
      })

      if (earnedXP > 0) {
        await this.addXP(earnedXP)
      }

      // Store metric in state
      this.metrics.push({
        id: metricId,
        category,
        timestamp: new Date().toISOString(),
        ...data
      })
    },

    async addXP(amount) {
      const oldLevel = this.level
      this.xp += amount
      
      // Recalculate level
      const newLevel = metricService.calculateLevel(this.xp)
      if (newLevel !== oldLevel) {
        this.level = newLevel
        // Update in database
        await userDb.updateUser(this.user.cosmicalName, {
          xp: this.xp,
          level: this.level
        })
      }
    },

    async unlockFeature(feature) {
      if (!this.space.features.includes(feature)) {
        this.space.features.push(feature)
        await userDb.updateUser(this.user?.cosmicalName, {
          space: this.space
        })
      }
    },

    async switchProfile(cosmicalName) {
      try {
        const targetUser = userDb.getUser(cosmicalName)
        if (!targetUser) return false

        // Store original user if first switch
        if (!this.originalUser) {
          this.originalUser = { ...this.user }
        }

        // Switch to target user
        this.user = targetUser
        this.isLoggedIn = true
        this.displayName = targetUser.displayName || targetUser.cosmicalName
        this.cosmicalEmail = targetUser.email
        this.isAdmin = targetUser.role === 'admin'
        this.isExplorer = targetUser.role === 'explorer'
        this.isVerified = targetUser.verified || false

        return true
      } catch (error) {
        console.error('Profile switch error:', error)
        return false
      }
    },

    async revertToOriginalProfile() {
      if (!this.originalUser) return false
      
      const success = await this.switchProfile(this.originalUser.cosmicalName)
      if (success) {
        this.originalUser = null
      }
      return success
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['user', 'isLoggedIn', 'isAdmin', 'isExplorer', 'isVerified', 
                'displayName', 'cosmicalEmail', 'explorerExpiry', 
                'verificationDetails', 'space', 'wallet', 'spaceMetrics', 'stepProgress',
                'metrics', 'xp', 'level']
      }
    ]
  }
})
