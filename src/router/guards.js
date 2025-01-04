import { useUserStore } from '../stores/user'

export function setupRouteGuards(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    
    // Check if route requires admin
    if (to.meta.requiresAdmin && !userStore.isAdmin) {
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // Check if route requires auth
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // Check explorer expiry
    if (userStore.isExplorer && userStore.isExplorerExpired) {
      userStore.logout()
      next({ 
        path: '/login',
        query: { message: 'Explorer session expired' }
      })
      return
    }

    next()
  })
}
