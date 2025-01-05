import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'

// Mock the userDb service
vi.mock('../../services/userDb', () => ({
  userDb: {
    getUser: vi.fn((name) => Promise.resolve({
      cosmicalName: name,
      role: name === 'admin' ? 'admin' : 'user',
      isVerified: true
    })),
    createUser: vi.fn(() => Promise.resolve(true)),
    updateUser: vi.fn(() => Promise.resolve(true))
  }
}))

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const store = useUserStore()
    expect(store.isLoggedIn).toBe(false)
    expect(store.user).toBeNull()
  })

  it('handles regular user login correctly', async () => {
    const store = useUserStore()
    await store.login({ cosmicalName: 'testUser' })
    expect(store.isLoggedIn).toBe(true)
    expect(store.user.cosmicalName).toBe('testUser')
    expect(store.isAdmin).toBe(false)
  })

  it('handles admin login correctly', async () => {
    const store = useUserStore()
    await store.login({ cosmicalName: 'admin' })
    expect(store.isLoggedIn).toBe(true)
    expect(store.user.cosmicalName).toBe('admin')
    expect(store.isAdmin).toBe(true)
  })

  it('handles explorer login correctly', async () => {
    const store = useUserStore()
    await store.loginAsExplorer()
    expect(store.isLoggedIn).toBe(true)
    expect(store.isExplorer).toBe(true)
  })

  it('handles logout correctly', async () => {
    const store = useUserStore()
    await store.login({ cosmicalName: 'testUser' })
    store.logout()
    expect(store.isLoggedIn).toBe(false)
    expect(store.user).toBeNull()
  })

  it('updates profile correctly', async () => {
    const store = useUserStore()
    await store.login({ cosmicalName: 'testUser' })
    await store.updateProfile({ displayName: 'Test User' })
    expect(store.displayName).toBe('Test User')
  })
})
