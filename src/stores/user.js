import { defineStore } from 'pinia'
import { userDb } from '../services/userDb'
import { metricService } from '../services/achievements'

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

    async login({ cosmicalName }) {
      try {
        const user = await userDb.getUser(cosmicalName)
        if (!user) {
          return false
        }

        // Set user data
        this.user = user
        this.isLoggedIn = true
        this.displayName = user.displayName || cosmicalName
        this.cosmicalEmail = user.email
        this.isAdmin = user.role === 'admin'
        this.isExplorer = user.role === 'explorer'
        this.isVerified = user.verified || false
        
        // Set explorer expiry if applicable
        if (this.isExplorer) {
          const now = new Date()
          this.explorerExpiry = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)).toISOString()
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
          // Set explorer specific state
          this.isExplorer = true
          this.explorerExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days
          
          // Update last login for explorer
          userDb.updateUser(cosmicalName, { 
            lastLogin: new Date().toISOString(),
            isExplorer: true,
            explorerExpiry: this.explorerExpiry
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
    }
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
