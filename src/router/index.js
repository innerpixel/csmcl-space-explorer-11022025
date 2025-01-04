import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import { setupRouteGuards } from './guards'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      if (store.isExplorer) {
        next({ name: 'explorer' })
      } else {
        next()
      }
    }
  },
  {
    path: '/explorer',
    name: 'explorer',
    component: () => import('../views/ExplorerLanding.vue'),
    meta: { requiresExplorer: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/UserDashboard.vue'),
    meta: { requiresAuth: true }
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
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/documentation',
    name: 'documentation',
    component: () => import('../views/Documentation.vue')
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

  // Check for explorer-only routes
  if (to.meta.requiresExplorer && !store.isExplorer) {
    next({ name: 'home' })
    return
  }

  // Check for admin-only routes
  if (to.meta.requiresAdmin && !store.isAdmin) {
    next({ name: 'home' })
    return
  }

  // Check for auth required routes
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
})

export default router
