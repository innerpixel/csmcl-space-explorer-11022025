import { defineStore } from 'pinia'
import { userDb } from '../services/userDb'

export const useUserStore = defineStore('user', {
  state: () => ({
    mode: 'explorer',        // 'explorer' | 'user' | 'admin'
    user: null,             // Current user data
    adminPrivileges: false, // Admin privileges flag
    preferences: {
      displayName: null,
      email: null,
      level: 'novice',
      metrics: [],
      achievements: []
    }
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    isAdmin: (state) => state.adminPrivileges,
    isExplorer: (state) => state.mode === 'explorer',
    currentLevel: (state) => state.preferences.level,
    displayName: (state) => state.preferences.displayName || (state.user?.displayName || 'Explorer'),
    explorerExpiry: (state) => state.preferences?.demoData?.lastVisited || null,
    isExplorerExpired: (state) => {
      if (!state.preferences?.demoData?.lastVisited) return false
      const expiry = new Date(state.preferences.demoData.lastVisited)
      expiry.setDate(expiry.getDate() + 10) // 10 days trial
      return Date.now() > expiry.getTime()
    }
  },

  actions: {
    // Start explorer mode
    async startExplorer() {
      try {
        // Get demo bots from userDb
        const demoBots = await userDb.getBotUsers()
        
        // Set up explorer state
        this.mode = 'explorer'
        this.user = {
          email: 'explorer@csmcl.space',
          id: 'explorer-demo',
          displayName: '🚀 Explorer',
          isDemo: true
        }
        this.adminPrivileges = false
        this.preferences = {
          displayName: '🚀 Explorer',
          level: 'novice',
          metrics: [
            { name: 'Spaces Visited', value: 0 },
            { name: 'Bots Interacted', value: 0 },
            { name: 'Features Discovered', value: 0 }
          ],
          achievements: [],
          demoBots: demoBots,
          demoData: {
            lastVisited: new Date().toISOString(),
            interactions: 0,
            favorites: []
          }
        }
        
        return { 
          success: true,
          message: 'Welcome to Explorer Mode! Feel free to look around and try things out.'
        }
      } catch (error) {
        console.error('Failed to start explorer mode:', error)
        return {
          success: false,
          error: 'Failed to start explorer mode'
        }
      }
    },

    // Regular user login
    async login(email, password) {
      try {
        const result = await userDb.authenticateUser(email, password)
        if (!result.success) {
          throw new Error(result.error)
        }

        this.mode = 'user'
        this.user = result.user
        this.preferences = result.user.preferences || {
          displayName: result.user.email.split('@')[0],
          email: result.user.email,
          level: 'novice',
          metrics: [],
          achievements: []
        }

        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          error: error.message || 'Login failed'
        }
      }
    },

    // Toggle admin privileges
    async toggleAdmin(enable, secondFactor) {
      try {
        if (enable && !this.user) {
          throw new Error('Must be logged in to enable admin privileges')
        }

        if (enable) {
          const result = await userDb.verifyAdminAccess(this.user.email, secondFactor)
          if (!result.success) {
            throw new Error(result.error)
          }
        }

        this.adminPrivileges = enable
        this.mode = enable ? 'admin' : 'user'

        return { success: true }
      } catch (error) {
        console.error('Admin toggle error:', error)
        return {
          success: false,
          error: error.message || 'Failed to toggle admin privileges'
        }
      }
    },

    // Logout
    logout() {
      this.mode = 'explorer'
      this.user = null
      this.adminPrivileges = false
      this.preferences = {
        displayName: null,
        email: null,
        level: 'novice',
        metrics: [],
        achievements: []
      }
    },

    // Update user preferences
    updatePreferences(updates) {
      this.preferences = {
        ...this.preferences,
        ...updates
      }
      if (this.user) {
        userDb.updateUserPreferences(this.user.email, this.preferences)
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['mode', 'user', 'adminPrivileges', 'preferences']
      }
    ]
  }
})
