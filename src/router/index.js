import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import { setupRouteGuards } from './guards'
import Home from '../views/Home.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: Home,
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
        next({ name: store.isExplorer ? 'explorer' : 'home' })
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
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      // Check if user is logged in and not expired
      if (store.isExplorer && store.isExplorerExpired) {
        next({ name: 'login' })
        return
      }
      next()
    }
  },
  {
    path: '/network',
    name: 'network',
    component: () => import('../views/Network.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/explorer',
    name: 'explorer',
    component: () => import('../views/ExplorerLanding.vue'),
    meta: { requiresAuth: true },
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      if (!store.isExplorer) {
        next({ name: 'home' })
        return
      }
      if (store.isExplorerExpired) {
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
      requiresAdmin: true 
    },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../views/AdminDashboard.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('../views/Admin.vue')
      },
      {
        path: 'users/new',
        name: 'admin-user-new',
        component: () => import('../components/admin/UserEditForm.vue')
      },
      {
        path: 'users/:id/edit',
        name: 'admin-user-edit',
        component: () => import('../components/admin/UserEditForm.vue'),
        props: true
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
