import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Login from '../Login.vue'
import { useUserStore } from '../../stores/user'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('Login.vue', () => {
  const createWrapper = () => {
    return mount(Login, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                isLoggedIn: false,
                user: null
              }
            }
          })
        ]
      }
    })
  }

  it('renders login form', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('handles regular login submission', async () => {
    const wrapper = createWrapper()
    const store = useUserStore()
    
    await wrapper.find('input[type="text"]').setValue('testUser')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(store.login).toHaveBeenCalledWith({ 
      cosmicalName: 'testUser',
      phrase: 'temp-disabled' 
    })
  })

  it('handles explorer login', async () => {
    const wrapper = createWrapper()
    const store = useUserStore()
    
    const explorerButton = wrapper.findAll('button').find(btn => btn.text() === 'Start Exploring')
    await explorerButton.trigger('click')
    expect(store.loginAsExplorer).toHaveBeenCalled()
  })

  it('shows error message on failed login', async () => {
    const wrapper = createWrapper()
    const store = useUserStore()
    
    // Mock login to fail
    store.login.mockRejectedValueOnce(new Error('Login failed'))
    
    await wrapper.find('input[type="text"]').setValue('testUser')
    await wrapper.find('form').trigger('submit.prevent')
    
    // Wait for error message to appear
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Login failed')
  })
})
