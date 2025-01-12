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
    if (to.meta.requiresAuth && !userStore.isLoggedIn && userStore.mode !== 'explorer') {
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // Check if route is restricted to certain modes
    if (to.meta.roles && to.meta.roles.length > 0) {
      if (!to.meta.roles.includes(userStore.mode)) {
        if (userStore.mode === 'explorer') {
          next({ path: '/explorer' })
        } else if (userStore.isLoggedIn) {
          next({ path: '/dashboard' })
        } else {
          next({ path: '/login' })
        }
        return
      }
    }

    next()
  })
}
