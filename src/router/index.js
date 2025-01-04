import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      const store = useUserStore()
      if (store.isLoggedIn) {
        next({ name: 'home' })
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
    redirect: '/onboarding/identity',
    children: [
      {
        path: 'identity',
        name: 'identity',
        component: () => import('../components/registration/IdentityForm.vue')
      },
      {
        path: 'verify',
        name: 'verify',
        component: () => import('../components/registration/VerificationForm.vue'),
        beforeEnter: (to, from, next) => {
          const store = useUserStore()
          if (!store.stepProgress?.identity?.completed) {
            next({ name: 'identity' })
          } else {
            next()
          }
        }
      },
      {
        path: 'space',
        name: 'space',
        component: () => import('../components/space-setup/SpaceSetup.vue'),
        beforeEnter: (to, from, next) => {
          const store = useUserStore()
          if (!store.stepProgress?.verify?.completed) {
            next({ name: 'verify' })
          } else {
            next()
          }
        }
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

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const store = useUserStore()
  
  if (to.meta.requiresAuth && !store.isLoggedIn) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
