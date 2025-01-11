import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import UserEditForm from '@/components/admin/UserEditForm.vue'
import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/admin/users',
      name: 'admin-users',
      component: { template: '<div>Users List</div>' }
    }
  ]
})

describe('UserEditForm.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    // Create fresh pinia and mount component for each test
    wrapper = mount(UserEditForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              user: {
                user: null,
                isLoggedIn: false
              }
            }
          }),
          router
        ]
      }
    })
    store = useUserStore()
  })

  describe('Form Validation', () => {
    it('validates display name length', async () => {
      const input = wrapper.find('input[placeholder="Enter display name"]')
      await input.setValue('ab')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.text()).toContain('Display name must be at least 3 characters')
    })

    it('validates email format', async () => {
      const input = wrapper.find('input[type="email"]')
      await input.setValue('invalid-email')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.text()).toContain('Please enter a valid email address')
    })

    it('validates cosmical name uniqueness', async () => {
      // Mock userDb.getLocalUsers to return a user with known cosmical name
      vi.mock('@/services/userDb', () => ({
        userDb: {
          getLocalUsers: () => [{
            cosmicalName: 'existing-user'
          }]
        }
      }))

      const input = wrapper.find('input[placeholder="Enter Cosmical name"]')
      await input.setValue('existing-user')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.text()).toContain('This Cosmical name is already taken')
    })

    it('validates recovery phrase length for new users', async () => {
      const input = wrapper.find('input[placeholder="Enter recovery phrase"]')
      await input.setValue('short')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.text()).toContain('Recovery phrase must be at least 8 characters')
    })

    it('requires terms agreement for new users', async () => {
      await wrapper.find('form').trigger('submit')
      expect(wrapper.text()).toContain('You must agree to the terms and conditions')
    })
  })

  describe('Form Submission', () => {
    it('creates new user with correct data', async () => {
      // Fill in valid form data
      await wrapper.find('input[placeholder="Enter display name"]').setValue('Test User')
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[placeholder="Enter Cosmical name"]').setValue('test-user')
      await wrapper.find('input[placeholder="Enter recovery phrase"]').setValue('secure-recovery-phrase')
      await wrapper.find('input[type="checkbox"]').setValue(true)

      // Mock userDb.createUser
      const mockCreateUser = vi.fn()
      vi.mock('@/services/userDb', () => ({
        userDb: {
          getLocalUsers: () => [],
          createUser: mockCreateUser
        }
      }))

      await wrapper.find('form').trigger('submit')

      // Verify createUser was called with correct data
      expect(mockCreateUser).toHaveBeenCalledWith({
        displayName: 'Test User',
        email: 'test@example.com',
        cosmicalName: 'test-user',
        recoveryPhrase: 'secure-recovery-phrase',
        agreeToTerms: true,
        role: 'user',
        verified: false
      })
    })

    it('shows success notification after user creation', async () => {
      // Fill in valid form data
      await wrapper.find('input[placeholder="Enter display name"]').setValue('Test User')
      await wrapper.find('input[type="email"]').setValue('test@example.com')
      await wrapper.find('input[placeholder="Enter Cosmical name"]').setValue('test-user')
      await wrapper.find('input[placeholder="Enter recovery phrase"]').setValue('secure-recovery-phrase')
      await wrapper.find('input[type="checkbox"]').setValue(true)

      // Mock successful user creation
      vi.mock('@/services/userDb', () => ({
        userDb: {
          getLocalUsers: () => [],
          createUser: vi.fn()
        }
      }))

      await wrapper.find('form').trigger('submit')

      // Verify success notification
      expect(wrapper.find('.notification-success').exists()).toBe(true)
      expect(wrapper.text()).toContain('User created successfully')
    })
  })

  describe('Cancellation', () => {
    it('shows confirmation dialog when cancelling with changes', async () => {
      // Make a change to the form
      await wrapper.find('input[placeholder="Enter display name"]').setValue('Test User')
      
      // Click cancel button
      await wrapper.find('button', { text: 'Cancel' }).trigger('click')
      
      // Verify confirmation dialog is shown
      expect(wrapper.find('.confirmation-dialog').exists()).toBe(true)
    })

    it('navigates back without confirmation when no changes made', async () => {
      const routerPush = vi.spyOn(router, 'push')
      
      // Click cancel button without making changes
      await wrapper.find('button', { text: 'Cancel' }).trigger('click')
      
      // Verify direct navigation
      expect(routerPush).toHaveBeenCalledWith({ name: 'admin-users' })
    })
  })
})
