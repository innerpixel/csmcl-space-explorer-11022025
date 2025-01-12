import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import { setupRouteGuards } from './guards'
import Home from '../views/Home.vue'
import AdminInit from '../views/admin/Init.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      breadcrumb: 'Home'
    },
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      // If user is an explorer, always redirect to explorer page
      if (store.isLoggedIn && store.isExplorer) {
        next({ name: 'explorer' })
        return
      }
      next()
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      if (store.isLoggedIn) {
        next({ name: store.isExplorer ? 'explorer' : 'dashboard' })
      } else {
        next()
      }
    }
  },
  {
    path: '/documentation',
    name: 'documentation',
    component: () => import('../views/Documentation.vue'),
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      // If coming from explorer page, ensure explorer docs are shown
      if (from.name === 'explorer' || store.isExplorer) {
        to.meta.showExplorerDocs = true
      }
      next()
    }
  },
  {
    path: '/onboarding',
    component: () => import('../views/Onboarding.vue'),
    redirect: '/onboarding/verification',
    children: [
      {
        path: 'verification',
        name: 'verification',
        component: () => import('../components/onboarding/AccountVerification.vue')
      },
      {
        path: 'space',
        name: 'space',
        component: () => import('../components/space-setup/SpaceSetup.vue'),
        meta: { requiresVerification: true }
      }
    ]
  },

  // Protected routes
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/UserDashboard.vue'),
    meta: { 
      requiresAuth: true,
      breadcrumb: 'Dashboard',
      roles: ['user', 'admin']
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { 
      requiresAuth: true,
      breadcrumb: 'Profile',
      roles: ['user', 'admin', 'explorer']
    },
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      // Check if user is logged in and not expired
      if (store.isExplorer && store.isExplorerExpired) {
        next({ name: 'login' })
        return
      }
      // For explorer, ensure profile view is in explorer mode
      if (store.isExplorer) {
        to.meta.explorerMode = true
      }
      next()
    }
  },
  {
    path: '/network',
    name: 'network',
    component: () => import('../views/Network.vue'),
    meta: { 
      requiresAuth: true,
      breadcrumb: 'Network',
      roles: ['user', 'admin']
    }
  },
  {
    path: '/explorer',
    name: 'explorer',
    component: () => import('../views/ExplorerLanding.vue'),
    meta: { 
      breadcrumb: 'Explorer',
      roles: ['explorer']
    },
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      if (!store.mode === 'explorer') {
        next({ name: 'login' })
        return
      }
      next()
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminLayout.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumb: 'Admin',
      roles: ['admin']
    },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../views/AdminDashboard.vue'),
        meta: {
          breadcrumb: 'Dashboard'
        }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../views/Admin.vue'),
        meta: {
          breadcrumb: 'User Management'
        }
      },
      {
        path: 'users/new',
        name: 'admin-user-new',
        component: () => import('../components/admin/UserEditForm.vue'),
        meta: {
          breadcrumb: 'New User'
        }
      },
      {
        path: 'users/:id/edit',
        name: 'admin-user-edit',
        component: () => import('../components/admin/UserEditForm.vue'),
        props: true,
        meta: {
          breadcrumb: 'Edit User'
        }
      },
      {
        path: 'init',
        name: 'admin-init',
        component: () => import('../components/admin/AdminInit.vue'),
        beforeEnter: (to, from, next) => {
          const user = userDb.getUser('CSMCL_ADMIN')
          if (!user?.requiresInit) {
            next({ name: 'admin-dashboard' })
          } else {
            next()
          }
        }
      }
    ],
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      if (!store.isAdmin) {
        next({ name: 'home' })
        return
      }
      next()
    }
  },
  {
    path: '/admin/init',
    name: 'admin-init',
    component: AdminInit,
    meta: {
      requiresNoAuth: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: 'Settings',
      roles: ['user', 'admin']
    }
  },

  // Catch all route for 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Setup route guards
setupRouteGuards(router)

// Add error handling for dynamic imports
router.onError((error) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload()
  }
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const store = useUserStore()
  
  // Check for verification requirement
  if (to.meta.requiresVerification && !store.isVerified) {
    next({ name: 'verification' })
    return
  }
  
  // Check for admin requirement
  if (to.meta.requiresAdmin && !store.isAdmin) {
    next({ name: 'home' })
    return
  }
  
  // Check for explorer requirement
  if (to.meta.requiresExplorer && !store.isExplorer) {
    next({ name: 'home' })
    return
  }
  
  // Check for auth requirement
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  next()
})

export default router
